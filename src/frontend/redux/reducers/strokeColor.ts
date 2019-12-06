import { RootState } from '.';
import { SetStrokeColorAction } from '../actions/strokeColor';

export function strokeColor(
    state: RootState,
    action: SetStrokeColorAction
): RootState {
    return {
        ...state,
        strokeColor: action.color,
    };
}
