import { Tool } from './Tool';
import { Point } from '../../shared/Point';

export class MoveTool extends Tool {
    private startingPoint?: Point;

    onMouseDown(point: Point) {
        // Clone point
        this.startingPoint = point;
    }

    onMouseMove(point: Point) {
        if (!this.startingPoint) {
            return;
        }
        this.context.translateX(this.startingPoint.x - point.x);
        this.context.translateY(this.startingPoint.y - point.y);

        this.strokeManager.redraw();
    }

    onMouseUp() {
        this.startingPoint = undefined;
    }
}
