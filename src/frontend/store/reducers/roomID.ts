import { RootState } from '..';
import { SetRoomIDAction } from '../actions/roomID';

export function roomID(state: RootState, action: SetRoomIDAction): RootState {
    return {
        ...state,
        roomID: action.roomID,
        roomIDHistory: state.roomIDHistory.concat([state.roomID]),
    };
}
