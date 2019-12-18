export const CLEAR_ROOM_HISTORY = 'CLEAR_ROOM_HISTORY';

export interface ClearRoomHistoryAction {
    type: typeof CLEAR_ROOM_HISTORY;
}

export function clearRoomHistory(): ClearRoomHistoryAction {
    return {
        type: CLEAR_ROOM_HISTORY,
    };
}
