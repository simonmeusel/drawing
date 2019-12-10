import { createStore, Store } from 'redux';
import { createReducer } from 'typesafe-actions';
import { UUID } from '../../shared/UUID';
import { ToolProperties } from '../components/canvas/tools/Tool';
import {
    SET_SELECTED_TOOL,
    SetSelectedToolAction,
} from './actions/selectedTool';
import {
    SET_TOOL_PROPERTIES,
    SetToolPropertiesAction,
} from './actions/toolProperties';
import { getPersistentState, saveState } from './localStorage';
import { selectedTool } from './reducers/selectedTool';
import { toolProperties } from './reducers/toolProperties';

export const initialState: RootState = getPersistentState({
    toolProperties: {
        strokeColor: '#000000ff',
        fillColor: '#cc0044ff',
    },
    selectedTool: 2,
    roomID: getRoomID(),
});

function getRoomID() {
    let hash = new URL(location.href).hash.substring(1);
    if (hash == '') {
        hash = UUID.generateString();
    }
    return hash;
}

export type RootAction = SetToolPropertiesAction | SetSelectedToolAction;

export interface RootState {
    toolProperties: ToolProperties;
    selectedTool: number;
    roomID: string;
}

export type RootStore = Store<RootState, RootAction>;

export const reducer = createReducer<RootState, RootAction>(initialState)
    .handleType(SET_SELECTED_TOOL, selectedTool)
    .handleType(SET_TOOL_PROPERTIES, toolProperties);

export function createPersistentStore() {
    const store = createStore(reducer);
    store.subscribe(() => {
        saveState(store);
    });
}
