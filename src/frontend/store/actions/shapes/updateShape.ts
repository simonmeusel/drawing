import { Shape } from '../../../../shared/Shape';

export const UPDATE_SHAPE = 'UPDATE_SHAPE';

export interface UpdateShapeAction {
    type: typeof UPDATE_SHAPE;
    shape: Shape;
}

export function updateShape(shape: Shape): UpdateShapeAction {
    return {
        type: UPDATE_SHAPE,
        shape,
    };
}
