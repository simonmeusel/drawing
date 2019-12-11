import { RootState } from '..';
import { SetSelectedToolAction } from '../actions/selectedTool';

export function selectedTool(
    state: RootState,
    action: SetSelectedToolAction
): RootState {
    return {
        ...state,
        selectedTool: action.tool,
    };
}
