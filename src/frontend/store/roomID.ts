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

export function onRoomIDUpdate(store: RootStore) {
    setTimeout(() => {
        const roomID = getRoomID();
        if (roomID && store.getState().roomID != roomID) {
            store.dispatch(setRoomID(roomID));
        }

        removeRoomIDFromURL();
    }, 0);
}

export function getURLWithRoomID(roomID: string) {
    const url = new URL(location.href);
    url.hash = '#' + roomID;
    return url.toString();
}

export function addRoomIDToBrowserHistory(roomID: string) {
    setURL(getURLWithRoomID(roomID));
    removeRoomIDFromURL();
}

function removeRoomIDFromURL() {
    // Remove room ID from URL so it cannot be seen by others
    const url = new URL(location.href);
    url.hash = '';
    setURL(url.toString());
}

function setURL(url: string) {
    history.pushState({}, document.title, url);
}
