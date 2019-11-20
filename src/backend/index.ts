import express from 'express';
import * as WebSocket from 'ws';
import { createServer } from 'http';
import { Stroke } from '../shared/Stroke';
import { MongoClient, Binary, Collection, IndexSpecification } from 'mongodb';
import { BackendUUID } from './BackendUUID';
import { BoundingBox, doBoundingBoxesOverlap } from '../shared/BoundingBox';
import { Request } from '../shared/Request';

type RawStroke = Pick<Stroke, 'boundingBox' | 'type'> & { _id: Binary };

type ExtendedWebSocket = WebSocket & {
    boundingBox?: BoundingBox;
};

function parseStroke(stroke: Stroke[] | any): RawStroke {
    if (typeof stroke != 'object' || Array.isArray(stroke)) {
        throw new Error('Strokes are not of type object');
    }
    const rs = {
        ...stroke,
        _id: BackendUUID.convertStringToBinary(stroke.id),
    };
    delete rs.id;
    return rs;
}

function serializeStrokes(rawStrokes: RawStroke[]): string {
    const strokes: Stroke[] = rawStrokes.map(rs => {
        const s = {
            ...rs,
            id: BackendUUID.convertBinaryToString(rs._id),
        };
        delete s._id;
        return s;
    });
    return JSON.stringify(strokes);
}

async function findRawStrokes(
    rawStrokesCollection: Collection<RawStroke>,
    _boundingBox: BoundingBox
) {
    // TODO: Only return strokes inside of bounding box
    return await rawStrokesCollection.find({}).toArray();
}

async function createIndexes(rawStrokesCollection: Collection<RawStroke>) {
    const indexes: IndexSpecification[] = [];
    for (const field of [
        'boundingBox.maxX',
        'boundingBox.minX',
        'boundingBox.maxY',
        'boundingBox.minY',
    ]) {
        indexes.push({
            key: {
                [field]: 1,
            },
            name: field,
            background: true,
        });
    }

    rawStrokesCollection.createIndexes(indexes);
}

async function start() {
    console.log('Connecting to database');

    const mongoClient = await MongoClient.connect(
        process.env.MONGODB_CONNECTION_URI || 'mongodb://localhost:27017/db',
        { useNewUrlParser: true, useUnifiedTopology: true }
    );

    console.log('Connected to database');

    const rawStrokesCollection = mongoClient
        .db('drawing')
        .collection<RawStroke>('strokes');

    rawStrokesCollection.deleteMany({});

    await createIndexes(rawStrokesCollection);

    const app = express();
    const server = createServer(app);

    const webSocketServer = new WebSocket.Server({ server });

    app.use(express.static('dist'));

    webSocketServer.on('connection', (webSocket: ExtendedWebSocket) => {
        webSocket.on('message', async data => {
            try {
                const request: Request = JSON.parse(data.toString());
                // TODO: Validate request data

                if (request.command == 'setBoundingBox') {
                    webSocket.boundingBox = request.boundingBox;
                    webSocket.send(
                        serializeStrokes(
                            await findRawStrokes(
                                rawStrokesCollection,
                                webSocket.boundingBox
                            )
                        )
                    );
                } else if (request.command == 'updateStroke') {
                    const rawStroke = parseStroke(request.stroke);

                    await rawStrokesCollection.updateOne(
                        { _id: rawStroke._id },
                        { $set: rawStroke },
                        { upsert: true }
                    );

                    for (const clientWebSocket of webSocketServer.clients as Set<
                        ExtendedWebSocket
                    >) {
                        if (
                            webSocket != clientWebSocket &&
                            clientWebSocket.readyState === WebSocket.OPEN &&
                            clientWebSocket.boundingBox != undefined
                        ) {
                            if (
                                doBoundingBoxesOverlap(
                                    rawStroke.boundingBox,
                                    clientWebSocket.boundingBox!
                                ) ||
                                (request.oldBoundingBox &&
                                    doBoundingBoxesOverlap(
                                        request.oldBoundingBox,
                                        clientWebSocket.boundingBox!
                                    ))
                            ) {
                                clientWebSocket.send(
                                    serializeStrokes([rawStroke])
                                );
                            }
                        }
                    }
                }
            } catch (error) {
                console.warn(error);
                webSocket.close(1003);
            }
        });
    });

    server.listen(8080);

    console.log('Webserver listening on port 8080 (http://localhost:8080)');
}

start();
