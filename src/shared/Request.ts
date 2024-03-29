import { BoundingBox } from './BoundingBox';
import { Point } from './Point';
import { Shape } from './Shape';

export type Request =
    | UpdateShapeRequest
    | DeleteShapeRequest
    | SetBoundingBoxRequest
    | SetMousePositionRequest;

export interface UpdateShapeRequest {
    command: 'updateShape';
    shape: Shape;
}

export interface DeleteShapeRequest {
    command: 'deleteShape';
    // TODO: Add JSON schema validator: UUID
    /**
     * @minLength 36
     * @maxLength 36
     */
    shapeID: string;
}

export interface SetBoundingBoxRequest {
    command: 'setBoundingBox';
    boundingBox: BoundingBox;
}

export interface SetMousePositionRequest {
    command: 'setMousePosition';
    // TODO: Add JSON schema validator: UUID
    /**
     * @minLength 36
     * @maxLength 36
     */
    mouseID: string;
    mousePosition: Point;
}
