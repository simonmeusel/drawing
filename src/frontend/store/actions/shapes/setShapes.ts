import { Shapes } from '../../../../shared/Shape';

export const SET_SHAPES = 'SET_SHAPES';

export interface SetShapesAction {
    type: typeof SET_SHAPES;
    shapes: Shapes;
}

export function setShapes(shapes: Shapes): SetShapesAction {
    return {
        type: SET_SHAPES,
        shapes,
    };
}
