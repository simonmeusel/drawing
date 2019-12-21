export const DELETE_SHAPE = 'DELETE_SHAPE';

export interface DeleteShapeAction {
    type: typeof DELETE_SHAPE;
    shapeID: string;
}

export function deleteShape(shapeID: string): DeleteShapeAction {
    return {
        type: DELETE_SHAPE,
        shapeID,
    };
}
