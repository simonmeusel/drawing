import { RootState } from '../..';
import { SetScreenAction } from '../../actions/screen/setScreen';

export function reduceSetScreen(
    state: RootState,
    action: SetScreenAction
): RootState {
    return {
        ...state,
        screen: action.screen,
    };
}
