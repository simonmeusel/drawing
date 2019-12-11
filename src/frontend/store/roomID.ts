import { RootStore } from '.';
import { UUID } from '../../shared/UUID';
import { setRoomID } from './actions/roomID';

export function getRoomID() {
    let hash = new URL(location.href).hash.substring(1);
    return hash || undefined;
}

export function getOrGenerateRoomID() {
    return getRoomID() || UUID.generateString();
}

export function updateRoomID(store: RootStore) {
    const roomID = getRoomID();
    if (roomID && store.getState().roomID != roomID) {
        store.dispatch(setRoomID(roomID));
    }
}
