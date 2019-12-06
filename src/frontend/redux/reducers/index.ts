import { createReducer } from 'typesafe-actions';
import { ToolProperties } from '../../components/canvas/tools/Tool';
import {
    SET_SELECTED_TOOL,
    SetSelectedToolAction,
} from '../actions/selectedTool';
import {
    SET_TOOL_PROPERTIES,
    SetToolPropertiesAction,
} from '../actions/toolProperties';
import { selectedTool } from './selectedTool';
import { toolProperties } from './toolProperties';

export const initialState = {
    toolProperties: {
        strokeColor: '#000000ff',
        fillColor: '#cc0044ff',
    },
    selectedTool: 2,
};

export type RootAction = SetToolPropertiesAction | SetSelectedToolAction;

export interface RootState {
    toolProperties: ToolProperties;
    selectedTool: number;
}

export const reducer = createReducer<RootState, RootAction>(initialState)
    .handleType(SET_SELECTED_TOOL, selectedTool)
    .handleType(SET_TOOL_PROPERTIES, toolProperties);
