import { ToolProperties } from '../../components/canvas/tools/Tool';

export const SET_TOOL_PROPERTIES = 'SET_TOOL_PROPERTIES';

export interface SetToolPropertiesAction {
    type: typeof SET_TOOL_PROPERTIES;
    toolProperties: Partial<ToolProperties>;
}

export function setToolProperties(
    toolProperties: Partial<ToolProperties>
): SetToolPropertiesAction {
    return {
        type: SET_TOOL_PROPERTIES,
        toolProperties: toolProperties,
    };
}
