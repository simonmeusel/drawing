import { Point } from '../../../../shared/Point';
import { RootDispatch } from '../../../store';
import { Context } from '../Context';

export interface ToolProperties {
    strokeColor: string;
    fillColor: string;
}

export abstract class Tool {
    constructor(protected dispatch: RootDispatch, protected context: Context) {}

    abstract onMouseDown(point: Point, toolProperties: ToolProperties);
    abstract onMouseMove(point: Point, toolProperties: ToolProperties);
    abstract onMouseUp(point: Point, toolProperties: ToolProperties);
}
