import { BoundingBox } from './BoundingBox';
import { Point } from './Point';
import { Shape } from './Shape';

export type Request =
    | UpdateShapeRequest
    | DeleteShapeBoxRequest
    | SetBoundingBoxRequest
    | SetMousePositionRequest;

export interface UpdateShapeRequest {
    command: 'updateShape';
    shape: Shape;
}

export interface DeleteShapeBoxRequest {
    command: 'deleteShape';
    shapeID: string;
}

export interface SetBoundingBoxRequest {
    command: 'setBoundingBox';
    boundingBox: BoundingBox;
}

export interface SetMousePositionRequest {
    command: 'setMousePosition';
    // TODO: Add JSON schema validator: UUID
    mouseID: string;
    mousePosition: Point;
}
