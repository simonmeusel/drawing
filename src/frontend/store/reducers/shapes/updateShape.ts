import { RootState } from '../..';
import { UpdateShapeAction } from '../../actions/shapes/updateShape';

export function reduceUpdateShape(
    state: RootState,
    action: UpdateShapeAction
): RootState {
    const oldStateShape = state.document.shapes[action.shape.id];
    const historyOldShape =
        action.shape.id in state.document.history.editedShapes
            ? state.document.history.editedShapes[action.shape.id]
            : oldStateShape;

    const editedShapes = {
        ...state.document.history.editedShapes,
        [action.shape.id]: historyOldShape,
    };
    if (action.addToHistory) {
        delete editedShapes[action.shape.id];
    }

    return {
        ...state,
        document: {
            ...state.document,
            shapes: {
                ...state.document.shapes,
                [action.shape.id]: action.shape,
            },
            history: {
                ...state.document.history,
                undoHistory: state.document.history.undoHistory.concat(
                    action.addToHistory
                        ? [
                              {
                                  newShape: action.shape,
                                  oldShape: historyOldShape,
                              },
                          ]
                        : []
                ),
                editedShapes,
            },
        },
    };
}
