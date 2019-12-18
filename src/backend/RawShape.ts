import { Binary } from 'mongodb';
import { Shape } from '../shared/Shape';

export type RawShape = Pick<Shape, Exclude<keyof Shape, 'id'>> & {
    _id: Binary;
    roomID: Binary;
};
