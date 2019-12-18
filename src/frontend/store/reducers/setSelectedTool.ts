import { RootState } from '..';
import { SetSelectedToolAction } from '../actions/selectedTool';

export function reduceSetSelectedTool(
    state: RootState,
    action: SetSelectedToolAction
): RootState {
    return {
        ...state,
        selectedTool: action.tool,
    };
}
