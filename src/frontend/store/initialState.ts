import { Point } from '../../shared/Point';
import { Shape, Shapes } from '../../shared/Shape';
import { UUID } from '../../shared/UUID';
import { ToolProperties } from '../components/canvas/tools/Tool';
import { getPersistentState } from './localStorage';
import { generateRoomID } from './roomID';

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

/**
 * If undo is pressed, the old shape has to be restored.
 */
export type ShapeHistoryElement =
    | {
          oldShape: undefined;
          newShape: Shape;
      }
    | {
          oldShape: Shape;
          newShape: undefined;
      }
    | {
          oldShape: Shape;
          newShape: Shape;
      };

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
    document: {
        shapes: Shapes;
        history: {
            undoHistory: ShapeHistoryElement[];
            redoHistory: ShapeHistoryElement[];
            editedShapes: Shapes;
        };
    };
    screen: Screen;
    importedImagePath: string;
}

export const importedImagePath = '/kekw.png';

export const initialScreen: Screen = {
    centerPoint: { x: 0, y: 0 },
    width: 1,
};

export const initialHistory: RootState['document']['history'] = {
    undoHistory: [],
    redoHistory: [],
    editedShapes: {},
};

export const initialDocument: RootState['document'] = {
    shapes: {},
    history: initialHistory,
};

export function getInitialState() {
    return getPersistentState({
        toolProperties: {
            fillColor: '#cc0044ff',
            strokeColor: '#000000ff',
            imageUrl: 'no image',
        },
        selectedTool: 2,
        roomID: generateRoomID(),
        roomIDHistory: [],
        mouseID: UUID.generateString(),
        mousePositions: {},
        document: initialDocument,
        screen: initialScreen,
        importedImagePath: importedImagePath,
    });
}
