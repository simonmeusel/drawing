import { RootState } from '..';
import { SetToolPropertiesAction } from '../actions/setToolProperties';

export function reduceSetToolProperties(
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
