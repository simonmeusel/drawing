import { BoundingBox } from './BoundingBox';

export type StrokeType = 'ellipse' | 'rectangle' | 'lines';

export interface Stroke {
    id: string;
    boundingBox: BoundingBox;
    type: StrokeType;
    data?: any;
}
