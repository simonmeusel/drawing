import { RootState } from '../..';
import { reduceUndo } from './undo';

export function reduceRedo(state: RootState): RootState {
    return swapHistories(reduceUndo(swapHistories(state)));
}

function swapHistories(state: RootState): RootState {
    return {
        ...state,
        document: {
            ...state.document,
            history: {
                ...state.document.history,
                undoHistory: state.document.history.redoHistory,
                redoHistory: state.document.history.undoHistory,
            },
        },
    };
}
