import { Screen } from '../../initialState';

export const SET_SCREEN = 'SET_SCREEN';

export interface SetScreenAction {
    type: typeof SET_SCREEN;
    screen: Screen;
}

export function setScreen(screen: Screen): SetScreenAction {
    return {
        type: SET_SCREEN,
        screen,
    };
}
