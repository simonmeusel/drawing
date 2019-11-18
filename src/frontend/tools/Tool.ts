import { Context } from '../Context';
import { StrokeManager } from '../StrokeManager';
import { Point } from '../../shared/BoundingBox';

export abstract class Tool {
    constructor(protected strokeManager: StrokeManager) {}

    abstract onMouseDown(point: Point);
    abstract onMouseMove(point: Point);
    abstract onMouseUp(point: Point);
}
