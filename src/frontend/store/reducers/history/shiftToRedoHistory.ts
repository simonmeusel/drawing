import { RootState } from '../..';

export function reduceShiftToRedoHistory(state: RootState): RootState {
    const historyElement =
        state.document.history.undoHistory[
            state.document.history.undoHistory.length - 1
        ];
    if (!historyElement) {
        return state;
    }

    return {
        ...state,
        document: {
            ...state.document,
            history: {
                ...state.document.history,
                undoHistory: state.document.history.undoHistory.slice(
                    0,
                    state.document.history.undoHistory.length - 1
                ),
                redoHistory: state.document.history.redoHistory.concat([
                    {
                        oldShape: historyElement.newShape,
                        newShape: historyElement.oldShape as any,
                    },
                ]),
            },
        },
    };
}
