import {
    Binary,
    Collection,
    Db,
    IndexSpecification,
    MongoClient,
} from 'mongodb';
import * as URI from 'urijs';
import { BoundingBox } from '../shared/BoundingBox';
import { Shape } from '../shared/Shape';
import { BackendUUID } from './BackendUUID';
import { migrate } from './migrate';
import { RawShape } from './RawShape';

export class Database {
    private mongoClient?: MongoClient;
    private dbName: string;
    private db?: Db;
    private rawShapesCollection?: Collection<RawShape>;

    public constructor(private connectionString: string) {
        const parts = URI.parse(connectionString);
        this.dbName = parts.path!.substring(1);
    }

    public async connect() {
        this.mongoClient = await MongoClient.connect(this.connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        this.db = this.mongoClient.db(this.dbName);
        this.rawShapesCollection = this.db.collection<RawShape>('shapes');

        await this.createIndexes();

        await migrate(this.rawShapesCollection);
    }

    public parseShape(shape: Shape | any, roomID: Binary): RawShape {
        if (typeof shape != 'object' || Array.isArray(shape)) {
            throw new Error('Shapes are not of type object');
        }
        const rs = {
            ...shape,
            _id: BackendUUID.convertStringToBinary(shape.id),
            roomID,
        };
        delete rs.id;
        return rs;
    }

    public async updateShape(roomID: Binary, rawShape: RawShape) {
        await this.rawShapesCollection!.updateOne(
            { _id: rawShape._id, roomID },
            { $set: rawShape },
            { upsert: true }
        );
    }

    public async deleteShape(roomID: Binary, shapeID: Binary) {
        await this.rawShapesCollection!.deleteOne({
            _id: shapeID,
            roomID,
        });
    }

    public serializeShapes(rawShapes: RawShape[]) {
        return rawShapes.map((rs) => {
            const s: any = {
                ...rs,
                id: BackendUUID.convertBinaryToString(rs._id),
            };
            delete s._id;
            delete s.roomID;
            return s as Shape;
        });
    }

    public async findRawShape(roomID: Binary, shapeID: Binary) {
        return await this.rawShapesCollection!.findOne({
            _id: shapeID,
            roomID,
        });
    }

    public async findRawShapes(roomID: Binary, _boundingBox: BoundingBox) {
        if (!this.rawShapesCollection) {
            throw new Error();
        }

        // TODO: Only return shapes inside of bounding box
        return this.rawShapesCollection
            .find({
                roomID,
            })
            .toArray();
    }

    public async createIndexes() {
        if (!this.rawShapesCollection) {
            throw new Error();
        }

        const indexes: IndexSpecification[] = [];
        for (const field of [
            'roomID',
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

        this.rawShapesCollection.createIndexes(indexes);
    }
}
