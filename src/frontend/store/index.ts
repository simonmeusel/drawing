import { createStore, Dispatch, Store } from 'redux';
import { createReducer } from 'typesafe-actions';
import { Shapes } from '../../shared/Shape';
import { ToolProperties } from '../components/canvas/tools/Tool';
import {
    CLEAR_ROOM_HISTORY,
    ClearRoomHistoryAction,
} from './actions/rooms/clearRoomHistory';
import { SET_ROOM_ID, SetRoomIDAction } from './actions/rooms/setRoomID';
import {
    SET_SELECTED_TOOL,
    SetSelectedToolAction,
} from './actions/setSelectedTool';
import {
    SET_TOOL_PROPERTIES,
    SetToolPropertiesAction,
} from './actions/setToolProperties';
import { DeleteShapeAction, DELETE_SHAPE } from './actions/shapes/deleteShape';
import { SetShapesAction, SET_SHAPES } from './actions/shapes/setShapes';
import { UpdateShapeAction, UPDATE_SHAPE } from './actions/shapes/updateShape';
import { getPersistentState, saveState } from './localStorage';
import { reduceClearRoomHistory } from './reducers/rooms/clearRoomHistory';
import { reduceSetRoomID } from './reducers/rooms/setRoomID';
import { reduceSetSelectedTool } from './reducers/setSelectedTool';
import { reduceSetToolProperties } from './reducers/setToolProperties';
import { getOrGenerateRoomID } from './roomID';
import { reduceSetShapes } from './reducers/shapes/setShapes';
import { reduceDeleteShape } from './reducers/shapes/deleteShape';
import { reduceUpdateShape } from './reducers/shapes/updateShape';

export const initialState: RootState = getPersistentState({
    toolProperties: {
        strokeColor: '#000000ff',
        fillColor: '#cc0044ff',
    },
    selectedTool: 2,
    roomID: getOrGenerateRoomID(),
    roomIDHistory: [],
    document: {
        shapes: {},
    },
});

export type RootAction =
    | SetRoomIDAction
    | ClearRoomHistoryAction
    | SetToolPropertiesAction
    | SetSelectedToolAction
    | DeleteShapeAction
    | UpdateShapeAction
    | SetShapesAction;

export type RootDispatch = Dispatch<RootAction>;

export interface DispatchProps {
    dispatch: RootDispatch;
}

export interface RootState {
    toolProperties: ToolProperties;
    selectedTool: number;
    roomID: string;
    roomIDHistory: string[];
    document: { shapes: Shapes };
}

export type RootStore = Store<RootState, RootAction>;

export const reducer = createReducer<RootState, RootAction>(initialState)
    .handleType(SET_ROOM_ID, reduceSetRoomID)
    .handleType(CLEAR_ROOM_HISTORY, reduceClearRoomHistory)
    .handleType(SET_SELECTED_TOOL, reduceSetSelectedTool)
    .handleType(SET_TOOL_PROPERTIES, reduceSetToolProperties)
    .handleType(SET_SHAPES, reduceSetShapes)
    .handleType(DELETE_SHAPE, reduceDeleteShape)
    .handleType(UPDATE_SHAPE, reduceUpdateShape);

export function createPersistentStore() {
    const store = createStore(reducer);
    store.subscribe(() => {
        saveState(store);
    });

    return store;
}
