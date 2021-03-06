import { RootState } from '../..';
import { SetRoomIDAction } from '../../actions/rooms/setRoomID';
import { initialDocument, initialScreen } from '../../initialState';

export const MAX_ROOM_ID_HISTORY_SIZE = 25;

export function reduceSetRoomID(
    state: RootState,
    action: SetRoomIDAction
): RootState {
    let roomIDHistory = state.roomIDHistory
        .filter((roomID) => state.roomID != roomID)
        .concat([state.roomID]);
    // Remove elements if list gets too long
    roomIDHistory = roomIDHistory.slice(
        Math.max(0, roomIDHistory.length - MAX_ROOM_ID_HISTORY_SIZE)
    );

    return {
        ...state,
        roomID: action.roomID,
        roomIDHistory,
        screen: initialScreen,
        document: initialDocument,
    };
}
