import { Point } from '../../../../shared/Point';
import { RootDispatch } from '../../../store';
import { Graphics } from '../Graphics';

export interface ToolProperties {
    strokeColor: string;
    fillColor: string;
}

export abstract class Tool {
    constructor(
        protected dispatch: RootDispatch,
        protected graphics: Graphics
    ) {}

    abstract onMouseDown(point: Point, toolProperties: ToolProperties);
    abstract onMouseMove(point: Point, toolProperties: ToolProperties);
    abstract onMouseUp(point: Point, toolProperties: ToolProperties);
}
