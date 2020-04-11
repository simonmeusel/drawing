import { Point } from '../../shared/Point';
import { Shapes } from '../../shared/Shape';
import { UUID } from '../../shared/UUID';
import { ToolProperties } from '../components/canvas/tools/Tool';
import { getPersistentState } from './localStorage';
import { getOrGenerateRoomID } from './roomID';

export interface Screen {
    centerPoint: Point;
    width: number;
}

export interface MousePositions {
    [mouseID: string]: {
        position: Point;
        lastUpdate: number;
    };
}

export interface RootState {
    toolProperties: ToolProperties;
    selectedTool: number;
    roomID: string;
    roomIDHistory: string[];
    /**
     * Mouse ID of the current user
     */
    mouseID: string;
    mousePositions: MousePositions;
    document: { shapes: Shapes };
    screen: Screen;
}

export const initialScreen: Screen = {
    centerPoint: { x: 0, y: 0 },
    width: 1,
};

export const initialDocument = {
    shapes: {},
};

export function getInitialState() {
    return getPersistentState({
        toolProperties: {
            fillColor: '#cc0044ff',
            strokeColor: '#000000ff',
        },
        selectedTool: 2,
        roomID: getOrGenerateRoomID(),
        roomIDHistory: [],
        mouseID: UUID.generateString(),
        mousePositions: {},
        document: initialDocument,
        screen: initialScreen,
    });
}
