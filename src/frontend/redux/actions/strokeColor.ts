import { Color } from '../../../shared/Color';

export const SET_STROKE_COLOR = 'SET_STROKE_COLOR';

export interface SetStrokeColorAction {
    type: typeof SET_STROKE_COLOR;
    color: Color;
}

export function setStrokeColor(color: Color): SetStrokeColorAction {
    return {
        type: SET_STROKE_COLOR,
        color,
    };
}
