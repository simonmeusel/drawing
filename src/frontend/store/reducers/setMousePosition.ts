import { RootState } from '..';
import { SetMousePositionAction } from '../actions/setMousePosition';

export function reduceSetMousePosition(
    state: RootState,
    action: SetMousePositionAction
): RootState {
    return {
        ...state,
        mousePositions: {
            ...state.mousePositions,
            [action.mouseID]: {
                position: action.mousePosition,
                lastUpdate: action.lastUpdate,
            },
        },
    };
}
