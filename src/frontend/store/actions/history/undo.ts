export const UNDO = 'UNDO';

export interface UndoAction {
    type: typeof UNDO;
}

export function undo(): UndoAction {
    return {
        type: UNDO,
    };
}
