import { Collection } from 'mongodb';
import { RawShape } from './RawShape';

export async function migrate(rawShapesCollection: Collection<RawShape>) {
    // 10. April 2020: Rename lines shapes to pencil shapes
    const result = await rawShapesCollection.updateMany(
        {
            type: 'lines' as any,
        },
        {
            $set: {
                type: 'pencil',
            },
        }
    );
    if (result.modifiedCount) {
        console.log(`Migrated ${result.modifiedCount} database records`);
    }
}
