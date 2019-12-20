import { RootState } from '../..';
import { UpdateShapeAction } from '../../actions/shapes/updateShape';

export function reduceUpdateShape(
    state: RootState,
    action: UpdateShapeAction
): RootState {
    return {
        ...state,
        document: {
            ...state.document,
            shapes: {
                ...state.document.shapes,
                [action.shape.id]: action.shape,
            },
        },
    };
}
