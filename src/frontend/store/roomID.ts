import { RootStore } from '.';
import { UUID } from '../../shared/UUID';
import { setRoomID } from './actions/rooms/setRoomID';

export function getRoomID() {
    let hash = new URL(location.href).hash.substring(1);
    return hash || undefined;
}

export function generateRoomID() {
    return UUID.generateString();
}

export function getOrGenerateRoomID() {
    return getRoomID() || generateRoomID();
}

export function updateRoomID(store: RootStore) {
    const roomID = getRoomID();
    if (roomID && store.getState().roomID != roomID) {
        store.dispatch(setRoomID(roomID));
    }
}
