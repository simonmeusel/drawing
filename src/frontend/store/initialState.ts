import { Point } from '../../shared/Point';
import { Shapes } from '../../shared/Shape';
import { ToolProperties } from '../components/canvas/tools/Tool';
import { getPersistentState } from './localStorage';
import { getOrGenerateRoomID } from './roomID';

export interface Screen {
    centerPoint: Point;
    width: number;
}

export interface RootState {
    toolProperties: ToolProperties;
    selectedTool: number;
    roomID: string;
    roomIDHistory: string[];
    document: { shapes: Shapes };
    screen: Screen;
}

export function getInitialState() {
    return getPersistentState({
        toolProperties: {
            fillColor: '#cc0044ff',
            strokeColor: '#000000ff',
        },
        selectedTool: 2,
        roomID: getOrGenerateRoomID(),
        roomIDHistory: [],
        document: {
            shapes: {},
        },
        screen: {
            centerPoint: { x: 0, y: 0 },
            width: 1,
        },
    });
}
