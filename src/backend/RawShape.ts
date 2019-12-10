import { Binary } from 'mongodb';
import { Shape } from '../shared/Shape';

export type RawShape = Pick<Shape, 'boundingBox' | 'type'> & {
    _id: Binary;
    roomID: Binary;
};
