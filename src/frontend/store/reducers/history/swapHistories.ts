import { RootState } from '../..';

export function reduceSwapHistories(state: RootState): RootState {
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
