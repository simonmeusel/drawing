import { RootState } from '..';
import { SetToolPropertiesAction } from '../actions/toolProperties';

export function toolProperties(
    state: RootState,
    action: SetToolPropertiesAction
): RootState {
    return {
        ...state,
        toolProperties: {
            ...state.toolProperties,
            ...action.toolProperties,
        },
    };
}
