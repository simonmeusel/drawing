import { Point } from '../../../../shared/Point';
import { Shape } from '../../../../shared/Shape';
import { Tool, ToolProperties } from './Tool';

export abstract class ShapeTool<T extends Shape> extends Tool {
    private activeShape?: T;

    public onMouseDown(point: Point, toolProperties: ToolProperties) {
        if (this.activeShape) {
            return;
        }
        this.activeShape = this.createShape(point, toolProperties);
        this.shapeManager.updateShape(this.activeShape);
        this.shapeManager.redraw();
    }

    public onMouseMove(point: Point, toolProperties: ToolProperties) {
        if (!this.activeShape) {
            return;
        }
        this.activeShape = this.updateShape(
            this.activeShape,
            point,
            toolProperties
        );
        this.shapeManager.updateShape(this.activeShape);
        this.shapeManager.redraw();
    }

    public onMouseUp(point: Point, toolProperties: ToolProperties) {
        if (!this.activeShape) {
            return;
        }
        this.onMouseMove(point, toolProperties);
        this.shapeManager.updateShape(this.activeShape);
        this.shapeManager.redraw();
        this.activeShape = undefined;
    }

    protected abstract createShape(
        point: Point,
        toolProperties: ToolProperties
    ): T;

    protected abstract updateShape(
        activeShape: T,
        point: Point,
        toolProperties: ToolProperties
    ): T;
}
