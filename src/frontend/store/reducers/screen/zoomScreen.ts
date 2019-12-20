import { RootState } from '../..';
import { Point } from '../../../../shared/Point';
import { ZoomScreenAction } from '../../actions/screen/zoomScreen';

export const ZOOM_MOVEMENT_WEIGHT = 100;

export function reduceZoomScreen(
    state: RootState,
    action: ZoomScreenAction
): RootState {
    // Ensure that canvas distance to the anchor point (mouse courser) remains the same
    const dx = state.screen.centerPoint.x - action.anchorPoint.x;
    const dy = state.screen.centerPoint.y - action.anchorPoint.y;
    const centerPoint: Point = {
        x: action.anchorPoint.x + dx * action.zoomFactor,
        y: action.anchorPoint.y + dy * action.zoomFactor,
    };

    const width = state.screen.width * action.zoomFactor;

    return {
        ...state,
        screen: {
            centerPoint,
            width,
        },
    };
}
