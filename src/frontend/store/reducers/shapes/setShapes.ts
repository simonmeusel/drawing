import { RootState } from '../..';
import { SetShapesAction } from '../../actions/shapes/setShapes';

export function reduceSetShapes(
    state: RootState,
    action: SetShapesAction
): RootState {
    return {
        ...state,
        document: {
            ...state.document,
            shapes: action.shapes,
        },
    };
}
