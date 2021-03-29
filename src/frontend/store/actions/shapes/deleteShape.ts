export const DELETE_SHAPE = 'DELETE_SHAPE';

export interface DeleteShapeAction {
    type: typeof DELETE_SHAPE;
    shapeID: string;
    addToHistory: boolean;
}

export function deleteShape(
    shapeID: string,
    addToHistory: boolean
): DeleteShapeAction {
    return {
        type: DELETE_SHAPE,
        shapeID,
        addToHistory,
    };
}
