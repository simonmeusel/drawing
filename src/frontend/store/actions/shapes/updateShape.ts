import { Shape } from '../../../../shared/Shape';

export const UPDATE_SHAPE = 'UPDATE_SHAPE';

export interface UpdateShapeAction {
    type: typeof UPDATE_SHAPE;
    shape: Shape;
    sendToBackend: boolean;
    addToHistory: boolean;
}

export function updateShape(
    shape: Shape,
    addToHistory: boolean,
    sendToBackend = true
): UpdateShapeAction {
    return {
        type: UPDATE_SHAPE,
        shape,
        sendToBackend,
        addToHistory,
    };
}
