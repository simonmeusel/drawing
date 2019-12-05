import { Tool, ToolProperties } from './Tool';
import { Shape } from '../../../../shared/Shape';
import { Point } from '../../../../shared/Point';

export abstract class ShapeTool<T extends Shape> extends Tool {
    private activeStroke?: T;

    public onMouseDown(point: Point, toolProperties: ToolProperties) {
        if (this.activeStroke) {
            return;
        }
        this.activeStroke = this.createStroke(point, toolProperties);
        this.shapeManager.updateStroke(this.activeStroke);
        this.shapeManager.redraw();
    }

    public onMouseMove(point: Point, toolProperties: ToolProperties) {
        if (!this.activeStroke) {
            return;
        }
        this.activeStroke = this.updateStroke(
            this.activeStroke,
            point,
            toolProperties
        );
        this.shapeManager.updateStroke(this.activeStroke);
        this.shapeManager.redraw();
    }

    public onMouseUp(point: Point, toolProperties: ToolProperties) {
        if (!this.activeStroke) {
            return;
        }
        this.onMouseMove(point, toolProperties);
        this.shapeManager.updateStroke(this.activeStroke);
        this.shapeManager.redraw();
        this.activeStroke = undefined;
    }

    protected abstract createStroke(
        point: Point,
        toolProperties: ToolProperties
    ): T;

    protected abstract updateStroke(
        activeStroke: T,
        point: Point,
        toolProperties: ToolProperties
    ): T;
}
