import { BoundingBox } from './BoundingBox';

export type ShapeType = 'ellipse' | 'rectangle' | 'lines';

export interface Shape {
    id: string;
    boundingBox: BoundingBox;
    type: ShapeType;
    data?: any;
}
