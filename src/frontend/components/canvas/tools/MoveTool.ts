import { Point } from '../../../../shared/Point';
import { moveScreen } from '../../../store/actions/screen/moveScreen';
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
        this.dispatch(
            moveScreen(
                this.startingPoint.x - point.x,
                this.startingPoint.y - point.y
            )
        );
    }

    onMouseUp() {
        this.startingPoint = undefined;
    }
}
