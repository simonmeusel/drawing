import { RootState, RootStore } from '.';
import { GenericShape, Shape, Shapes } from '../../shared/Shape';
import { getRoomID } from './roomID';

const saveDelay = 10000;

const timeouts = new Map<RootStore, any>();

export function getPersistentState(state: RootState): RootState {
    if (localStorage.getItem('drawing-state-v1')) {
        try {
            state = {
                ...state,
                ...JSON.parse(localStorage.getItem('drawing-state-v1')!),
            };
        } catch (error) {
            console.error(error);
        }
    }

    // Add empty undo and redo history for backwards compatibility
    if (!state.document.history) {
        state = {
            ...state,
            document: {
                ...state.document,
                history: {
                    undoHistory: [],
                    redoHistory: [],
                    editedShapes: {},
                },
            },
        };
    }

    const greyedShapes: Shapes = {};

    for (const id in state.document.shapes) {
        let shape: GenericShape = state.document.shapes[id];

        // Deep clone required parts
        shape = {
            ...shape,
            data: {
                ...shape.data,
            },
        } as GenericShape;

        if (shape.data.strokeColor) {
            shape.data.strokeColor = '#bbbbbb';
        }
        if (shape.data.fillColor) {
            shape.data.fillColor = '#bbbbbb';
        }

        greyedShapes[id] = shape as Shape;
    }

    // Overrides
    state = {
        ...state,
        roomID: getRoomID() || state.roomID,
        document: {
            ...state.document,
            shapes: greyedShapes,
        },
    };

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
