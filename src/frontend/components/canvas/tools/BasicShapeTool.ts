import { createBoundingBox } from '../../../../shared/BoundingBox';
import { Point } from '../../../../shared/Point';
import {
    BasicShape,
    BasicShapeType,
} from '../../../../shared/shapes/BasicShape';
import { UUID } from '../../../../shared/UUID';
import { Context } from '../Context';
import { ShapeManager } from '../ShapeManager';
import { ShapeTool } from './ShapeTool';
import { ToolProperties } from './Tool';

export class BasicShapeTool extends ShapeTool<BasicShape> {
    private startingPoint?: Point;

    constructor(
        shapeManager: ShapeManager,
        context: Context,
        private type: BasicShapeType
    ) {
        super(shapeManager, context);
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
