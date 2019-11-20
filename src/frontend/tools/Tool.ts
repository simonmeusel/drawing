import { StrokeManager } from '../StrokeManager';
import { Point } from '../../shared/Point';
import { Context } from '../Context';

export abstract class Tool {
    constructor(
        protected strokeManager: StrokeManager,
        protected context: Context
    ) {}

    abstract onMouseDown(point: Point);
    abstract onMouseMove(point: Point);
    abstract onMouseUp(point: Point);
}
