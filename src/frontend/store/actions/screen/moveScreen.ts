export const MOVE_SCREEN = 'MOVE_SCREEN';

export interface MoveScreenAction {
    type: typeof MOVE_SCREEN;
    x: number;
    y: number;
}

/**
 * Moves the screen by an absolute amount
 */
export function moveScreen(x: number, y: number): MoveScreenAction {
    return {
        type: MOVE_SCREEN,
        x,
        y,
    };
}
