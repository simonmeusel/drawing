import { RootState, RootStore } from '.';

const saveDelay = 1000;

const timeouts = new Map<RootStore, any>();

export function getPersistentState(state: RootState): RootState {
    if (localStorage.getItem('drawing-state-v1')) {
        try {
            state = JSON.parse(localStorage.getItem('drawing-state-v1')!);
        } catch (error) {
            console.error(error);
        }
    }
    return state;
}

export function saveState(store: RootStore, delay = true) {
    if (!delay) {
        saveStateImmediately(store);
        return;
    }

    if (timeouts.has(store)) {
        return;
    }

    timeouts.set(
        store,
        setTimeout(() => {
            saveStateImmediately(store);
        }, saveDelay)
    );
}

function saveStateImmediately(store: RootStore) {
    localStorage.setItem('drawing-state-v1', JSON.stringify(store.getState()));
    timeouts.delete(store);
}
