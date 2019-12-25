import { takeEvery, takeLatest } from 'redux-saga/effects';
import { WebSocketManager } from '../../api/WebSocketManager';
import { SET_ROOM_ID, SetRoomIDAction } from '../actions/rooms/setRoomID';
import { UPDATE_SHAPE, UpdateShapeAction } from '../actions/shapes/updateShape';

export function createWebSocketSaga(webSocketManager: WebSocketManager) {
    function setRoomID(action: SetRoomIDAction) {
        webSocketManager.setRoomID(action.roomID);
    }

    function updateShape(action: UpdateShapeAction) {
        console.log(action);
        if (action.sendToBackend) {
            console.log(action);
            webSocketManager.updateShape(action.shape);
        }
    }

    return function*() {
        yield takeLatest(SET_ROOM_ID, setRoomID);
        yield takeEvery(UPDATE_SHAPE, updateShape);
    };
}
