export const DELETE_SHAPE = 'DELETE_SHAPE';

export interface DeleteShapeAction {
    type: typeof DELETE_SHAPE;
    shapeID: string;
    addToHistory: boolean;
    sendToBackend: boolean;
}

export function deleteShape(
    shapeID: string,
    addToHistory: boolean,
    sendToBackend: boolean
): DeleteShapeAction {
    return {
        type: DELETE_SHAPE,
        shapeID,
        addToHistory,
        sendToBackend,
    };
}
