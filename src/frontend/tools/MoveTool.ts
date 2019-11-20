import { Tool } from './Tool';
import { Point } from '../../shared/Point';

export class MoveTool extends Tool {
    private lastPoint: Point | undefined;

    onMouseDown(point: Point) {
        this.lastPoint = point;
    }

    onMouseMove(point: Point) {
        console.log('move', this.lastPoint);

        if (!this.lastPoint) {
            console.log('returned');
            return;
        }
        this.context.translateXY(
            point.x - this.lastPoint.x,
            point.y - this.lastPoint.y
        );
        this.lastPoint = point;

        this.strokeManager.redraw();
    }

    onMouseUp() {
        this.lastPoint = undefined;
    }
}
