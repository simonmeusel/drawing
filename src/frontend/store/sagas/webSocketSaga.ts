import { takeEvery, takeLatest, throttle } from 'redux-saga/effects';
import { defaultDebounceDelay } from '../..';
import { WebSocketManager } from '../../api/WebSocketManager';
import { SetRoomIDAction, SET_ROOM_ID } from '../actions/rooms/setRoomID';
import {
    SetMousePositionAction,
    SET_MOUSE_POSITION,
} from '../actions/setMousePosition';
import { DeleteShapeAction, DELETE_SHAPE } from '../actions/shapes/deleteShape';
import { UpdateShapeAction, UPDATE_SHAPE } from '../actions/shapes/updateShape';

export function createWebSocketSaga(webSocketManager: WebSocketManager) {
    function onSetRoomID(action: SetRoomIDAction) {
        webSocketManager.setRoomID(action.roomID);
    }

    function onUpdateShape(action: UpdateShapeAction) {
        if (action.sendToBackend) {
            webSocketManager.updateShape(action.shape);
        }
    }

    function onDeleteShape(action: DeleteShapeAction) {
        if (action.sendToBackend) {
            webSocketManager.deleteShape(action.shapeID);
        }
    }

    function onSetMousePosition(action: SetMousePositionAction) {
        if (action.sendToBackend) {
            webSocketManager.setMousePosition(
                action.mouseID,
                action.mousePosition
            );
        }
    }

    return function* () {
        yield takeLatest(SET_ROOM_ID, onSetRoomID);
        yield takeEvery(UPDATE_SHAPE, onUpdateShape);
        yield takeEvery(DELETE_SHAPE, onDeleteShape);
        yield throttle(
            defaultDebounceDelay,
            SET_MOUSE_POSITION,
            onSetMousePosition
        );
    };
}
