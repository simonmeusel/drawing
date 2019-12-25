import { RootState, RootStore } from '.';
import { getRoomID } from './roomID';
import { initialDocument } from './initialState';
import { Shapes, Shape, GenericShape } from '../../shared/Shape';
import { BasicShape } from '../../shared/shapes/BasicShape';
import { LinesShape } from '../../shared/shapes/LinesShape';

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
