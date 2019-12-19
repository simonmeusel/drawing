import { BoundingBox } from './BoundingBox';
import { BasicShape } from './shapes/BasicShape';
import { LinesShape } from './shapes/LinesShape';

export interface GenericShape {
    id: string;
    boundingBox: BoundingBox;
    type: string;
    data?: any;
}

export type Shape = BasicShape | LinesShape;

export type ShapeType = ReturnType<typeof getShapeType>;

export function getShapeType(shape: Shape) {
    return shape.type;
}
