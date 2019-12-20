import { RootState } from '../..';
import { MoveScreenAction } from '../../actions/screen/moveScreen';

export function reduceMoveScreen(
    state: RootState,
    action: MoveScreenAction
): RootState {
    return {
        ...state,
        screen: {
            width: state.screen.width,
            centerPoint: {
                x: state.screen.centerPoint.x + action.x * state.screen.width,
                y: state.screen.centerPoint.y + action.y * state.screen.width,
            },
        },
    };
}
