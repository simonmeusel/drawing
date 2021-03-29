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
            undoHistory: state.document.undoHistory.concat(historyElements),
        },
    };
    delete newState.document.shapes[action.shapeID];
    return newState;
}
