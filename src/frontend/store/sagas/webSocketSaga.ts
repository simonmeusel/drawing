import {
    putResolve,
    select,
    takeEvery,
    takeLatest,
    throttle,
} from 'redux-saga/effects';
import { RootState } from '..';
import { defaultDebounceDelay } from '../..';
import { WebSocketManager } from '../../api/WebSocketManager';
import { REDO } from '../actions/history/redo';
import { shiftToRedoHistory } from '../actions/history/shiftToRedoHistory';
import { swapHistories } from '../actions/history/swapHistories';
import { undo, UNDO } from '../actions/history/undo';
import { SetRoomIDAction, SET_ROOM_ID } from '../actions/rooms/setRoomID';
import {
    SetMousePositionAction,
    SET_MOUSE_POSITION,
} from '../actions/setMousePosition';
import {
    deleteShape,
    DeleteShapeAction,
    DELETE_SHAPE,
} from '../actions/shapes/deleteShape';
import {
    updateShape,
    UpdateShapeAction,
    UPDATE_SHAPE,
} from '../actions/shapes/updateShape';
import { ShapeHistoryElement } from '../initialState';

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

    function* onUndo() {
        const historyElement: ShapeHistoryElement = yield select(
            (state: RootState) =>
                state.document.history.undoHistory[
                    state.document.history.undoHistory.length - 1
                ]
        );

        if (!historyElement) {
            return;
        }

        if (historyElement.newShape) {
            yield putResolve(
                deleteShape(historyElement.newShape.id, false, true)
            );
        } else {
            yield putResolve(updateShape(historyElement.oldShape, false, true));
        }

        yield putResolve(shiftToRedoHistory());
    }

    function* onRedo() {
        yield putResolve(swapHistories());
        yield putResolve(undo());
        yield putResolve(swapHistories());
    }

    return function* () {
        yield takeLatest(SET_ROOM_ID, onSetRoomID);
        yield takeEvery(UPDATE_SHAPE, onUpdateShape);
        yield takeEvery(DELETE_SHAPE, onDeleteShape);
        yield takeEvery(UNDO, onUndo);
        yield takeEvery(REDO, onRedo);
        yield throttle(
            defaultDebounceDelay,
            SET_MOUSE_POSITION,
            onSetMousePosition
        );
    };
}
