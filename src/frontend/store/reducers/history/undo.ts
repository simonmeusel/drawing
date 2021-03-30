import { RootState } from '../..';
import { deleteShape } from '../../actions/shapes/deleteShape';
import { updateShape } from '../../actions/shapes/updateShape';
import { reduceDeleteShape } from '../shapes/deleteShape';
import { reduceUpdateShape } from '../shapes/updateShape';

export function reduceUndo(state: RootState): RootState {
    const historyElement =
        state.document.undoHistory[state.document.undoHistory.length - 1];
    if (!historyElement) {
        return state;
    }
    if (historyElement.newShape) {
        state = reduceUpdateShape(
            state,
            updateShape(historyElement.newShape, false, true)
        );
    } else {
        state = reduceDeleteShape(
            state,
            deleteShape(historyElement.oldShape!.id, false)
        );
    }
    return {
        ...state,
        document: {
            ...state.document,
            undoHistory: state.document.undoHistory.slice(
                0,
                state.document.undoHistory.length - 1
            ),
            redoHistory: state.document.redoHistory.concat([
                {
                    oldShape: historyElement.newShape,
                    newShape: historyElement.oldShape as any,
                },
            ]),
        },
    };
}
