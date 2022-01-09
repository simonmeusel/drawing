import { addPointToBoundingBox, BoundingBox, createBoundingBox } from '../../../../shared/BoundingBox';
import { Point } from '../../../../shared/Point';
import { Tool, ToolMoveEvent, ToolProperties } from './Tool';

/**
 * We do not want people to see if someone takes a screenshot, so we do not show anything to the other users,
 * and we do not store the drawn image shape to the redux store
 * */
export class ExportImageTool extends Tool {
    private imageBoundingBox?: BoundingBox;

    private imageExportStarted?: boolean;

    onMouseDown(
        point: Point,
        _toolProperties: ToolProperties,
        _event: ToolMoveEvent
    ) {
        if (this.imageExportStarted !== undefined) {
            return;
        }
        this.imageBoundingBox = createBoundingBox(point, point);
        this.imageExportStarted = true;
    }

    onMouseMove(
        point: Point,
        _toolProperties: ToolProperties,
        _event: ToolMoveEvent
    ) {
        if (this.imageBoundingBox === undefined || !this.imageExportStarted) {
            return;
        }
        // TODO draw a rectangle here with the corresponding bounding box.
        this.imageBoundingBox = addPointToBoundingBox(this.imageBoundingBox, point);
    }

    onMouseUp() {
        if (!this.imageBoundingBox) {
            return;
        }
        this.graphics.getPartialImage(this.imageBoundingBox!);
        // make everything undefined
        this.imageBoundingBox = undefined;
        this.imageExportStarted = false;
    }
}
