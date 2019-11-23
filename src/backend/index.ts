import express from 'express';
import * as WebSocket from 'ws';
import { createServer } from 'http';
import { Shape } from '../shared/Shape';
import { MongoClient, Binary, Collection, IndexSpecification } from 'mongodb';
import { BackendUUID } from './BackendUUID';
import { BoundingBox, doBoundingBoxesOverlap } from '../shared/BoundingBox';
import { Request } from '../shared/Request';

type RawShape = Pick<Shape, 'boundingBox' | 'type'> & { _id: Binary };

type ExtendedWebSocket = WebSocket & {
    boundingBox?: BoundingBox;
};

function parseShape(shape: Shape[] | any): RawShape {
    if (typeof shape != 'object' || Array.isArray(shape)) {
        throw new Error('Shapes are not of type object');
    }
    const rs = {
        ...shape,
        _id: BackendUUID.convertStringToBinary(shape.id),
    };
    delete rs.id;
    return rs;
}

function serializeShape(rawShape: RawShape[]): string {
    const shapes: Shape[] = rawShape.map(rs => {
        const s = {
            ...rs,
            id: BackendUUID.convertBinaryToString(rs._id),
        };
        delete s._id;
        return s;
    });
    return JSON.stringify(shapes);
}

async function findRawShapes(
    rawShapesCollection: Collection<RawShape>,
    _boundingBox: BoundingBox
) {
    // TODO: Only return shapes inside of bounding box
    return await rawShapesCollection.find({}).toArray();
}

async function createIndexes(rawShapesCollection: Collection<RawShape>) {
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

    rawShapesCollection.createIndexes(indexes);
}

async function start() {
    console.log('Connecting to database');

    const mongoClient = await MongoClient.connect(
        process.env.MONGODB_CONNECTION_URI || 'mongodb://localhost:27017/db',
        { useNewUrlParser: true, useUnifiedTopology: true }
    );

    console.log('Connected to database');

    const rawShapesCollection = mongoClient
        .db('drawing')
        .collection<RawShape>('shapes');

    rawShapesCollection.deleteMany({});

    await createIndexes(rawShapesCollection);

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
                        serializeShape(
                            await findRawShapes(
                                rawShapesCollection,
                                webSocket.boundingBox
                            )
                        )
                    );
                } else if (request.command == 'updateShape') {
                    const rawShape = parseShape(request.shape);

                    await rawShapesCollection.updateOne(
                        { _id: rawShape._id },
                        { $set: rawShape },
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
                                    rawShape.boundingBox,
                                    clientWebSocket.boundingBox!
                                ) ||
                                (request.oldBoundingBox &&
                                    doBoundingBoxesOverlap(
                                        request.oldBoundingBox,
                                        clientWebSocket.boundingBox!
                                    ))
                            ) {
                                clientWebSocket.send(
                                    serializeShape([rawShape])
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
