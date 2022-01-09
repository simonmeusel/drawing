import { Point } from '../../../../shared/Point';
import { RootDispatch } from '../../../store';
import { Graphics } from '../Graphics';

export type ImageUrl = string; // maybe type validation with regex

export interface ToolProperties {
    strokeColor: string;
    fillColor: string;
    imageUrl: ImageUrl;
}

export type ToolMoveEvent = React.MouseEvent<Element, MouseEvent>;

export abstract class Tool {
    constructor(
        protected dispatch: RootDispatch,
        protected graphics: Graphics
    ) {}

    abstract onMouseDown(
        point: Point,
        toolProperties: ToolProperties,
        event: ToolMoveEvent
    );
    abstract onMouseMove(
        point: Point,
        toolProperties: ToolProperties,
        event: ToolMoveEvent
    );
    abstract onMouseUp(
        point: Point,
        toolProperties: ToolProperties,
        event: ToolMoveEvent
    );
}
