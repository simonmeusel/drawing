import { Tool } from './Tool';
import { Point } from '../../shared/Point';

export class MoveTool extends Tool {
    private lastPoint: Point | undefined;
    private counter: number = 0;

    onMouseDown(point: Point) {
        this.lastPoint = point;
    }

    onMouseMove(point: Point) {
        this.counter++;
        if (!this.lastPoint) {
            return;
        }
        if (this.counter == 10) {
            this.context.translateXY(
                -(point.x - this.lastPoint.x) * 1000,
                -(point.y - this.lastPoint.y) * 1000
            );
            this.counter = 0;
            this.lastPoint = point;
        }

        this.strokeManager.redraw();
    }

    onMouseUp() {
        this.lastPoint = undefined;
    }
}
