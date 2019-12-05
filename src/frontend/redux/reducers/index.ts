import { createReducer } from 'typesafe-actions';
import { SET_STROKE_COLOR, SetStrokeColorAction } from '../actions/strokeColor';
import { strokeColor } from './strokeColor';
import { Color } from '../../../shared/Color';

export const initialState = {
    strokeColor: '#000000ff',
};

export type RootAction = SetStrokeColorAction;

export interface RootState {
    strokeColor: Color;
}

export const reducer = createReducer<RootState, RootAction>(
    initialState
).handleType(SET_STROKE_COLOR, strokeColor);
