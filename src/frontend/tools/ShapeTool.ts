import { Tool } from './Tool';
import { Shape } from '../../shared/Shape';
import { Point } from '../../shared/Point';

export abstract class ShapeTool<T extends Shape> extends Tool {
    private activeStroke?: T;

    public onMouseDown(point: Point) {
        if (this.activeStroke) {
            return;
        }
        this.activeStroke = this.createStroke(point);
        this.strokeManager.updateStroke(this.activeStroke);
        this.strokeManager.redraw();
    }

    public onMouseMove(point: Point) {
        if (!this.activeStroke) {
            return;
        }
        this.activeStroke = this.updateStroke(this.activeStroke, point);
        this.strokeManager.updateStroke(this.activeStroke);
        this.strokeManager.redraw();
    }

    public onMouseUp(point: Point) {
        if (!this.activeStroke) {
            return;
        }
        this.onMouseMove(point);
        this.strokeManager.updateStroke(this.activeStroke);
        this.strokeManager.redraw();
        this.activeStroke = undefined;
    }

    protected abstract createStroke(point: Point): T;

    protected abstract updateStroke(activeStroke: T, point: Point): T;
}
