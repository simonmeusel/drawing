import { BoundingBox } from './BoundingBox';

export type StrokeType = 'ellipse' | 'rectangle';

export interface Stroke {
    id: string;
    boundingBox: BoundingBox;
    type: StrokeType;
}
