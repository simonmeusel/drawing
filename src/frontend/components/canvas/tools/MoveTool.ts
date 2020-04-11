import { Point } from '../../../../shared/Point';
import { moveScreen } from '../../../store/actions/screen/moveScreen';
import { Tool, ToolMoveEvent, ToolProperties } from './Tool';

export class MoveTool extends Tool {
    private startX: number | undefined;
    private startY: number | undefined;

    onMouseDown(
        _point: Point,
        _toolProperties: ToolProperties,
        event: ToolMoveEvent
    ) {
        this.startX = event.clientX;
        this.startY = event.clientY;
    }

    onMouseMove(
        _point: Point,
        _toolProperties: ToolProperties,
        event: ToolMoveEvent
    ) {
        if (this.startX == undefined || this.startY == undefined) {
            return;
        }
        this.dispatch(
            moveScreen(
                (this.startX - event.clientX) /
                    this.graphics.canvasWidthMultiplier,
                -(this.startY - event.clientY) /
                    this.graphics.canvasHeightMultiplier
            )
        );
        this.startX = event.clientX;
        this.startY = event.clientY;
    }

    onMouseUp() {
        this.startX = undefined;
        this.startY = undefined;
    }
}
