import { createBoundingBox } from '../../../../shared/BoundingBox';
import { Point } from '../../../../shared/Point';
import { ShapeType } from '../../../../shared/Shape';
import { BasicShape } from '../../../../shared/shapes/BasicShape';
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
        private type: ShapeType
    ) {
        super(shapeManager, context);
    }

    protected createStroke(point: Point, toolProperties: ToolProperties) {
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

    protected updateStroke(
        activeStroke: BasicShape,
        point: Point,
        toolProperties: ToolProperties
    ) {
        return {
            ...activeStroke,
            data: {
                strokeColor: toolProperties.strokeColor,
                fillColor: toolProperties.fillColor,
            },
            boundingBox: createBoundingBox(this.startingPoint!, point),
        };
    }
}
