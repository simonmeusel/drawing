import { RootState } from '../..';
import { deleteShape } from '../../actions/shapes/deleteShape';
import { updateShape } from '../../actions/shapes/updateShape';
import { reduceDeleteShape } from '../shapes/deleteShape';
import { reduceUpdateShape } from '../shapes/updateShape';

export function reduceUndo(state: RootState): RootState {
    const historyElement =
        state.document.history.undoHistory[
            state.document.history.undoHistory.length - 1
        ];
    if (!historyElement) {
        return state;
    }
    if (historyElement.newShape) {
        state = reduceDeleteShape(
            state,
            deleteShape(historyElement.newShape.id, false)
        );
    } else {
        state = reduceUpdateShape(
            state,
            updateShape(historyElement.oldShape, false, true)
        );
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
