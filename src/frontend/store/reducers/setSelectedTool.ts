import { RootState } from '..';
import { SetSelectedToolAction } from '../actions/setSelectedTool';

export function reduceSetSelectedTool(
    state: RootState,
    action: SetSelectedToolAction
): RootState {
    return {
        ...state,
        selectedTool: action.tool,
    };
}
