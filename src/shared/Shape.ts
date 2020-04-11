import { BoundingBox } from './BoundingBox';
import { BasicShape } from './shapes/BasicShape';
import { PencilShape } from './shapes/PencilShape';

export interface GenericShape {
    id: string;
    boundingBox: BoundingBox;
    type: string;
    data?: any;
}

export type Shape = BasicShape | PencilShape;

export type ShapeType = ReturnType<typeof getShapeType>;

export function getShapeType(shape: Shape) {
    return shape.type;
}

export interface Shapes {
    [roomID: string]: Shape;
}
