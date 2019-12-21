export const SET_SELECTED_TOOL = 'SET_SELECTED_TOOL';

export interface SetSelectedToolAction {
    type: typeof SET_SELECTED_TOOL;
    tool: number;
}

export function setSelectedTool(tool: number): SetSelectedToolAction {
    return {
        type: SET_SELECTED_TOOL,
        tool,
    };
}
