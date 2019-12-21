import { Point } from '../../../../shared/Point';

export const ZOOM_SCREEN = 'ZOOM_SCREEN';

export interface ZoomScreenAction {
    type: typeof ZOOM_SCREEN;
    anchorPoint: Point;
    zoomFactor: number;
}

export function zoomScreen(
    anchorPoint: Point,
    zoomFactor: number
): ZoomScreenAction {
    return {
        type: ZOOM_SCREEN,
        anchorPoint,
        zoomFactor,
    };
}
