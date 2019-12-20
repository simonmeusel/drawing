import { Point } from '../../../../shared/Point';
import { Tool } from './Tool';

export class MoveTool extends Tool {
    private startingPoint?: Point;

    onMouseDown(point: Point) {
        this.startingPoint = point;
    }

    onMouseMove(point: Point) {
        if (!this.startingPoint) {
            return;
        }
        this.context.translateX(this.startingPoint.x - point.x);
        this.context.translateY(this.startingPoint.y - point.y);
    }

    onMouseUp() {
        this.startingPoint = undefined;
    }
}
