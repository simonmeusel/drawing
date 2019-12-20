import { createStore, Dispatch, Store } from 'redux';
import { createReducer } from 'typesafe-actions';
import {
    CLEAR_ROOM_HISTORY,
    ClearRoomHistoryAction,
} from './actions/rooms/clearRoomHistory';
import { SET_ROOM_ID, SetRoomIDAction } from './actions/rooms/setRoomID';
import { MOVE_SCREEN, MoveScreenAction } from './actions/screen/moveScreen';
import { SET_SCREEN, SetScreenAction } from './actions/screen/setScreen';
import { ZOOM_SCREEN, ZoomScreenAction } from './actions/screen/zoomScreen';
import {
    SET_SELECTED_TOOL,
    SetSelectedToolAction,
} from './actions/setSelectedTool';
import {
    SET_TOOL_PROPERTIES,
    SetToolPropertiesAction,
} from './actions/setToolProperties';
import { DELETE_SHAPE, DeleteShapeAction } from './actions/shapes/deleteShape';
import { SET_SHAPES, SetShapesAction } from './actions/shapes/setShapes';
import { UPDATE_SHAPE, UpdateShapeAction } from './actions/shapes/updateShape';
import { getInitialState, RootState } from './initialState';
import { saveState } from './localStorage';
import { reduceClearRoomHistory } from './reducers/rooms/clearRoomHistory';
import { reduceSetRoomID } from './reducers/rooms/setRoomID';
import { reduceMoveScreen } from './reducers/screen/moveScreen';
import { reduceSetScreen } from './reducers/screen/setScreen';
import { reduceZoomScreen } from './reducers/screen/zoomScreen';
import { reduceSetSelectedTool } from './reducers/setSelectedTool';
import { reduceSetToolProperties } from './reducers/setToolProperties';
import { reduceDeleteShape } from './reducers/shapes/deleteShape';
import { reduceSetShapes } from './reducers/shapes/setShapes';
import { reduceUpdateShape } from './reducers/shapes/updateShape';

export { RootState };

export type RootAction =
    | SetRoomIDAction
    | ClearRoomHistoryAction
    | SetToolPropertiesAction
    | SetSelectedToolAction
    | DeleteShapeAction
    | UpdateShapeAction
    | SetShapesAction
    | ZoomScreenAction
    | SetScreenAction
    | MoveScreenAction;

export type RootDispatch = Dispatch<RootAction>;

export interface DispatchProps {
    dispatch: RootDispatch;
}

export type RootStore = Store<RootState, RootAction>;

export const reducer = createReducer<RootState, RootAction>(getInitialState())
    .handleType(SET_ROOM_ID, reduceSetRoomID)
    .handleType(CLEAR_ROOM_HISTORY, reduceClearRoomHistory)
    .handleType(SET_SELECTED_TOOL, reduceSetSelectedTool)
    .handleType(SET_TOOL_PROPERTIES, reduceSetToolProperties)
    .handleType(SET_SHAPES, reduceSetShapes)
    .handleType(DELETE_SHAPE, reduceDeleteShape)
    .handleType(UPDATE_SHAPE, reduceUpdateShape)
    .handleType(SET_SCREEN, reduceSetScreen)
    .handleType(MOVE_SCREEN, reduceMoveScreen)
    .handleType(ZOOM_SCREEN, reduceZoomScreen);

export function createPersistentStore() {
    const store = createStore(reducer);
    store.subscribe(() => {
        saveState(store);
    });

    return store;
}
