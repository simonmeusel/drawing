import { ShapeManager } from '../ShapeManager';
import { Point } from '../../../../shared/Point';
import { Context } from '../Context';

export interface ToolProperties {
    strokeColor: string;
}

export abstract class Tool {
    constructor(
        protected shapeManager: ShapeManager,
        protected context: Context
    ) {}

    abstract onMouseDown(point: Point, toolProperties: ToolProperties);
    abstract onMouseMove(point: Point, toolProperties: ToolProperties);
    abstract onMouseUp(point: Point, toolProperties: ToolProperties);
}
