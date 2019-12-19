import { RootState } from '../..';

export function reduceClearRoomHistory(state: RootState): RootState {
    return {
        ...state,
        roomIDHistory: [],
    };
}
