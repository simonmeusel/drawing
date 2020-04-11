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
                x: state.screen.centerPoint.x + action.x,
                y: state.screen.centerPoint.y + action.y,
            },
        },
    };
}
