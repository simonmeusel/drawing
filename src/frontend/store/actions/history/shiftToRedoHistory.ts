export const SHIFT_TO_REDO_HISTORY = 'SHIFT_TO_REDO_HISTORY';

export interface ShiftToRedoHistory {
    type: typeof SHIFT_TO_REDO_HISTORY;
}

export function shiftToRedoHistory(): ShiftToRedoHistory {
    return {
        type: SHIFT_TO_REDO_HISTORY,
    };
}
