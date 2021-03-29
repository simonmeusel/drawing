import { Point } from '../../../../shared/Point';
import { Shape } from '../../../../shared/Shape';
import { updateShape } from '../../../store/actions/shapes/updateShape';
import { Tool, ToolProperties } from './Tool';

export abstract class ShapeTool<T extends Shape> extends Tool {
    private activeShape?: T;

    public onMouseDown(point: Point, toolProperties: ToolProperties) {
        if (this.activeShape) {
            return;
        }
        this.activeShape = this.createShape(point, toolProperties);
        this.dispatch(updateShape(this.activeShape!, false));
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
        this.dispatch(updateShape(this.activeShape!, false));
    }

    public onMouseUp(point: Point, toolProperties: ToolProperties) {
        if (!this.activeShape) {
            return;
        }
        this.onMouseMove(point, toolProperties);
        this.dispatch(updateShape(this.activeShape!, true));
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
