import { BoundingBox, createBoundingBox } from '../../../../shared/BoundingBox';
import { Point } from '../../../../shared/Point';
import { RootDispatch } from '../../../store';
import { Graphics } from '../Graphics';
import { Tool, ToolMoveEvent, ToolProperties } from './Tool';

/**
 * When one clicks on the tool you get the image Path into the tool
 * */
export class DrawImageTool extends Tool {
    constructor(
        dispatch: RootDispatch,
        graphics: Graphics,
        private importedImagePath: string,
    ) {
        super(dispatch, graphics);
    }

    private startX?: number;
    private startY?: number;
    private imageImportStarted?: boolean;

    onMouseDown(
        _point: Point,
        _toolProperties: ToolProperties,
        event: ToolMoveEvent
    ) {
        this.startX = event.clientX;
        this.startY = event.clientY;
        this.imageImportStarted = true;
    }

    onMouseMove(
        _point: Point,
        _toolProperties: ToolProperties,
        event: ToolMoveEvent
    ) {
        if (this.startX == undefined || this.startY == undefined || !this.imageImportStarted) {
            return;
        }
        // TODO update image shape
        // @ts-ignore
        let _imageBoundingBox: BoundingBox = createBoundingBox({x: this.startX, y: this.startY}, {x: event.clientX, y: event.clientY});
        console.log(this.importedImagePath);
    }

    onMouseUp() {
        // TODO draw picture on canvas
        this.startX = undefined;
        this.startY = undefined;
    }
}
