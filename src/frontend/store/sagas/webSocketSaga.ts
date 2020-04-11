import { takeEvery, takeLatest, throttle } from 'redux-saga/effects';
import { defaultDebounceDelay } from '../..';
import { WebSocketManager } from '../../api/WebSocketManager';
import { SetRoomIDAction, SET_ROOM_ID } from '../actions/rooms/setRoomID';
import {
    SetMousePositionAction,
    SET_MOUSE_POSITION,
} from '../actions/setMousePosition';
import { UpdateShapeAction, UPDATE_SHAPE } from '../actions/shapes/updateShape';

export function createWebSocketSaga(webSocketManager: WebSocketManager) {
    function setRoomID(action: SetRoomIDAction) {
        webSocketManager.setRoomID(action.roomID);
    }

    function updateShape(action: UpdateShapeAction) {
        if (action.sendToBackend) {
            webSocketManager.updateShape(action.shape);
        }
    }

    function setMousePosition(action: SetMousePositionAction) {
        if (action.sendToBackend) {
            webSocketManager.setMousePosition(
                action.mouseID,
                action.mousePosition
            );
        }
    }

    return function* () {
        yield takeLatest(SET_ROOM_ID, setRoomID);
        yield takeEvery(UPDATE_SHAPE, updateShape);
        yield throttle(
            defaultDebounceDelay,
            SET_MOUSE_POSITION,
            setMousePosition
        );
    };
}
