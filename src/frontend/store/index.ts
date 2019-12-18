import { createStore, Store } from 'redux';
import { createReducer } from 'typesafe-actions';
import { ToolProperties } from '../components/canvas/tools/Tool';
import {
    CLEAR_ROOM_HISTORY,
    ClearRoomHistoryAction,
} from './actions/rooms/clearRoomHistory';
import { SET_ROOM_ID, SetRoomIDAction } from './actions/rooms/setRoomID';
import {
    SET_SELECTED_TOOL,
    SetSelectedToolAction,
} from './actions/selectedTool';
import {
    SET_TOOL_PROPERTIES,
    SetToolPropertiesAction,
} from './actions/toolProperties';
import { getPersistentState, saveState } from './localStorage';
import { reduceClearRoomHistory } from './reducers/rooms/clearRoomHistory';
import { reduceSetRoomID } from './reducers/rooms/setRoomID';
import { reduceSetSelectedTool } from './reducers/setSelectedTool';
import { reduceSetToolProperties } from './reducers/setToolProperties';
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
    | ClearRoomHistoryAction
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
    .handleType(SET_ROOM_ID, reduceSetRoomID)
    .handleType(CLEAR_ROOM_HISTORY, reduceClearRoomHistory)
    .handleType(SET_SELECTED_TOOL, reduceSetSelectedTool)
    .handleType(SET_TOOL_PROPERTIES, reduceSetToolProperties);

export function createPersistentStore() {
    const store = createStore(reducer);
    store.subscribe(() => {
        saveState(store);
    });
}
