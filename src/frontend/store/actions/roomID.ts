export const SET_ROOM_ID = 'SET_ROOM_ID';

export interface SetRoomIDAction {
    type: typeof SET_ROOM_ID;
    roomID: string;
}

export function setRoomID(roomID: string): SetRoomIDAction {
    return {
        type: SET_ROOM_ID,
        roomID,
    };
}
