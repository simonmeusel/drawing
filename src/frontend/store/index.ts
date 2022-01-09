import { applyMiddleware, createStore, Dispatch, Store } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createReducer } from 'typesafe-actions';
import { WebSocketManager } from '../api/WebSocketManager';
import { RedoAction } from './actions/history/redo';
import {
    ShiftToRedoHistory,
    SHIFT_TO_REDO_HISTORY,
} from './actions/history/shiftToRedoHistory';
import {
    SwapHistoriesAction,
    SWAP_HISTORIES,
} from './actions/history/swapHistories';
import { UndoAction } from './actions/history/undo';
import {
    ClearRoomHistoryAction,
    CLEAR_ROOM_HISTORY,
} from './actions/rooms/clearRoomHistory';
import { SetRoomIDAction, SET_ROOM_ID } from './actions/rooms/setRoomID';
import { MoveScreenAction, MOVE_SCREEN } from './actions/screen/moveScreen';
import { SetScreenAction, SET_SCREEN } from './actions/screen/setScreen';
import { ZoomScreenAction, ZOOM_SCREEN } from './actions/screen/zoomScreen';
import { SetImportedImagePathAction, SET_IMPORTED_IMAGE_PATH } from './actions/setImportedImagePath';
import {
    SetMousePositionAction,
    SET_MOUSE_POSITION,
} from './actions/setMousePosition';
import {
    SetSelectedToolAction,
    SET_SELECTED_TOOL,
} from './actions/setSelectedTool';
import {
    SetToolPropertiesAction,
    SET_TOOL_PROPERTIES,
} from './actions/setToolProperties';
import { DeleteShapeAction, DELETE_SHAPE } from './actions/shapes/deleteShape';
import { SetShapesAction, SET_SHAPES } from './actions/shapes/setShapes';
import { UpdateShapeAction, UPDATE_SHAPE } from './actions/shapes/updateShape';
import { getInitialState, RootState } from './initialState';
import { saveState } from './localStorage';
import { reduceShiftToRedoHistory } from './reducers/history/shiftToRedoHistory';
import { reduceSwapHistories } from './reducers/history/swapHistories';
import { reduceClearRoomHistory } from './reducers/rooms/clearRoomHistory';
import { reduceSetRoomID } from './reducers/rooms/setRoomID';
import { reduceMoveScreen } from './reducers/screen/moveScreen';
import { reduceSetScreen } from './reducers/screen/setScreen';
import { reduceZoomScreen } from './reducers/screen/zoomScreen';
import { reduceSetImportedImagePath } from './reducers/setImportedImagePath';
import { reduceSetMousePosition } from './reducers/setMousePosition';
import { reduceSetSelectedTool } from './reducers/setSelectedTool';
import { reduceSetToolProperties } from './reducers/setToolProperties';
import { reduceDeleteShape } from './reducers/shapes/deleteShape';
import { reduceSetShapes } from './reducers/shapes/setShapes';
import { reduceUpdateShape } from './reducers/shapes/updateShape';
import { createWebSocketSaga } from './sagas/webSocketSaga';

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
    | MoveScreenAction
    | SetMousePositionAction
    | UndoAction
    | RedoAction
    | ShiftToRedoHistory
    | SwapHistoriesAction
    | SetImportedImagePathAction;

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
    .handleType(ZOOM_SCREEN, reduceZoomScreen)
    .handleType(SET_MOUSE_POSITION, reduceSetMousePosition)
    .handleType(SHIFT_TO_REDO_HISTORY, reduceShiftToRedoHistory)
    .handleType(SWAP_HISTORIES, reduceSwapHistories)
    .handleType(SET_IMPORTED_IMAGE_PATH, reduceSetImportedImagePath);

export function createPersistentStore(webSocketManager: WebSocketManager) {
    const sagaMiddleware = createSagaMiddleware();

    const store = createStore(reducer, applyMiddleware(sagaMiddleware));
    store.subscribe(() => {
        saveState(store);
    });

    sagaMiddleware.run(createWebSocketSaga(webSocketManager));

    return store;
}
