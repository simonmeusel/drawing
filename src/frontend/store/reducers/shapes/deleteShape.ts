import { RootState } from '../..';
import { DeleteShapeAction } from '../../actions/shapes/deleteShape';

export function reduceDeleteShape(
    state: RootState,
    action: DeleteShapeAction
): RootState {
    const newState = {
        ...state,
    };
    delete newState.document.shapes[action.shapeID];
    return newState;
}
