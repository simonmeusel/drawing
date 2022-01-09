import { BoundingBox } from './BoundingBox';
import { BasicShape } from './shapes/BasicShape';
import { ImageShape } from './shapes/ImageShape';
import { PencilShape } from './shapes/PencilShape';

export interface GenericShape {
    // TODO: Add JSON schema validator: UUID
    /**
     * @minLength 36
     * @maxLength 36
     */
    id: string;
    boundingBox: BoundingBox;
    type: string;
    data?: any;
}

export type Shape = BasicShape | PencilShape | ImageShape;

export type ShapeType = ReturnType<typeof getShapeType>;

export function getShapeType(shape: Shape) {
    return shape.type;
}

export interface Shapes {
    [shapeID: string]: Shape;
}
