import { createStore, Store } from 'redux';
import { createReducer } from 'typesafe-actions';
import { ToolProperties } from '../components/canvas/tools/Tool';
import { SET_ROOM_ID, SetRoomIDAction } from './actions/roomID';
import {
    SET_SELECTED_TOOL,
    SetSelectedToolAction,
} from './actions/selectedTool';
import {
    SET_TOOL_PROPERTIES,
    SetToolPropertiesAction,
} from './actions/toolProperties';
import { getPersistentState, saveState } from './localStorage';
import { roomID } from './reducers/roomID';
import { selectedTool } from './reducers/selectedTool';
import { toolProperties } from './reducers/toolProperties';
import { getOrGenerateRoomID } from './roomID';

export const initialState: RootState = getPersistentState({
    toolProperties: {
        strokeColor: '#000000ff',
        fillColor: '#cc0044ff',
    },
    selectedTool: 2,
    roomID: getOrGenerateRoomID(),
    roomIDHistory: [],
});

export type RootAction =
    | SetRoomIDAction
    | SetToolPropertiesAction
    | SetSelectedToolAction;

export interface RootState {
    toolProperties: ToolProperties;
    selectedTool: number;
    roomID: string;
    roomIDHistory: string[];
}

export type RootStore = Store<RootState, RootAction>;

export const reducer = createReducer<RootState, RootAction>(initialState)
    .handleType(SET_ROOM_ID, roomID)
    .handleType(SET_SELECTED_TOOL, selectedTool)
    .handleType(SET_TOOL_PROPERTIES, toolProperties);

export function createPersistentStore() {
    const store = createStore(reducer);
    store.subscribe(() => {
        saveState(store);
    });
}
