export const REDO = 'REDO';

export interface RedoAction {
    type: typeof REDO;
}

export function redo(): RedoAction {
    return {
        type: REDO,
    };
}
