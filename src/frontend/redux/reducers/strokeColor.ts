import { SetStrokeColorAction } from '../actions/strokeColor';
import { RootState } from '.';

export function strokeColor(
    state: RootState,
    action: SetStrokeColorAction
): RootState {
    return {
        ...state,
        strokeColor: action.color,
    };
}
