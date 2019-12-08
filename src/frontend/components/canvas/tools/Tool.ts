import { Point } from '../../../../shared/Point';
import { Context } from '../Context';
import { ShapeManager } from '../ShapeManager';

export interface ToolProperties {
    strokeColor: string;
    fillColor: string;
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
