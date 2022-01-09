import { BoundingBox, createBoundingBox } from '../../../../shared/BoundingBox';
import { Point } from '../../../../shared/Point';
import { Tool, ToolMoveEvent, ToolProperties } from './Tool';

/**
 * We do not want people to see if someone takes a screenshot, so we do not show anything to the other users,
 * and we do not store the drawn image shape to the redux store
 * */
export class ExportImageTool extends Tool {
    private startX?: number;
    private startY?: number;
    private imageExportStarted?: boolean;

    onMouseDown(
        _point: Point,
        _toolProperties: ToolProperties,
        event: ToolMoveEvent
    ) {
        if (this.imageExportStarted) {
            return;
        }
        this.startX = event.clientX;
        this.startY = event.clientY;
        this.imageExportStarted = true;
    }

    onMouseMove(
        _point: Point,
        _toolProperties: ToolProperties,
        event: ToolMoveEvent
    ) {
        if (this.startX == undefined || this.startY == undefined || !this.imageExportStarted) {
            return;
        }
        // TODO draw a rectangle here with the corresponding bounding box.
        // @ts-ignore
        let _imageBoundingBox: BoundingBox = createBoundingBox({x: this.startX, y: this.startY}, {x: event.clientX, y: event.clientY});

    }

    onMouseUp() {
        // TODO save image to clipboard or something
        this.startX = undefined;
        this.startY = undefined;
    }
}
