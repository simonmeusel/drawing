import { createBoundingBox } from '../../../../shared/BoundingBox';
import { Point } from '../../../../shared/Point';
import {
    BasicShape,
    BasicShapeType,
} from '../../../../shared/shapes/BasicShape';
import { UUID } from '../../../../shared/UUID';
import { RootDispatch } from '../../../store';
import { Graphics } from '../Graphics';
import { ShapeTool } from './ShapeTool';
import { ToolProperties } from './Tool';

export class BasicShapeTool extends ShapeTool<BasicShape> {
    private startingPoint?: Point;

    constructor(
        dispatch: RootDispatch,
        graphics: Graphics,
        private type: BasicShapeType
    ) {
        super(dispatch, graphics);
    }

    protected createShape(point: Point, toolProperties: ToolProperties) {
        this.startingPoint = point;
        return {
            id: UUID.generateString(),
            type: this.type,
            boundingBox: {
                lowerLeftPoint: point,
                upperRightPoint: point,
            },
            data: {
                strokeColor: toolProperties.strokeColor,
                fillColor: toolProperties.fillColor,
            },
        };
    }

    protected updateShape(
        activeShape: BasicShape,
        point: Point,
        toolProperties: ToolProperties
    ) {
        return {
            ...activeShape,
            data: {
                strokeColor: toolProperties.strokeColor,
                fillColor: toolProperties.fillColor,
            },
            boundingBox: createBoundingBox(this.startingPoint!, point),
        };
    }
}
