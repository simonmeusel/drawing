import { RootState } from '../..';
import { DeleteShapeAction } from '../../actions/shapes/deleteShape';
import { ShapeHistoryElement } from '../../initialState';

export function reduceDeleteShape(
    state: RootState,
    action: DeleteShapeAction
): RootState {
    const historyElements: ShapeHistoryElement[] = [];
    if (action.addToHistory && state.document.shapes[action.shapeID]) {
        historyElements.push({
            newShape: undefined,
            oldShape: state.document.shapes[action.shapeID],
        });
    }
    const newState = {
        ...state,
        document: {
            ...state.document,
            shapes: {
                ...state.document.shapes,
            },
            history: {
                ...state.document.history,
                undoHistory:
                    state.document.history.undoHistory.concat(historyElements),
            },
        },
    };
    delete newState.document.shapes[action.shapeID];

    if (action.addToHistory) {
        newState.document.history.redoHistory = [];
    }

    return newState;
}
