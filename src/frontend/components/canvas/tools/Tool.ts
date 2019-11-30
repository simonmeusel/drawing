import { ShapeManager } from '../ShapeManager';
import { Point } from '../../../../shared/Point';
import { Context } from '../Context';

export abstract class Tool {
    constructor(
        protected shapeManager: ShapeManager,
        protected context: Context
    ) {}

    abstract onMouseDown(point: Point);
    abstract onMouseMove(point: Point);
    abstract onMouseUp(point: Point);
}
