import { Point } from '../../../shared/Point';

export const SET_MOUSE_POSITION = 'SET_MOUSE_POSITION';

export interface SetMousePositionAction {
    type: typeof SET_MOUSE_POSITION;
    mouseID: string;
    mousePosition: Point;
    lastUpdate: number;
    sendToBackend: boolean;
}

export function setMousePosition(
    mouseID: string,
    mousePosition: Point,
    sendToBackend = true
): SetMousePositionAction {
    return {
        type: SET_MOUSE_POSITION,
        mouseID,
        mousePosition,
        lastUpdate: Date.now(),
        sendToBackend,
    };
}
