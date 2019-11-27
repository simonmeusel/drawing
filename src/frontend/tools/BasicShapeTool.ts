import { createBoundingBox } from '../../shared/BoundingBox';
import { ShapeType } from '../../shared/Shape';
import { UUID } from '../../shared/UUID';
import { Point } from '../../shared/Point';
import { ShapeManager } from '../ShapeManager';
import { Context } from '../Context';
import { ShapeTool } from './ShapeTool';
import { BasicShape } from '../../shared/shapes/BasicShape';

export class BasicShapeTool extends ShapeTool<BasicShape> {
    private startingPoint?: Point;

    constructor(
        shapeManager: ShapeManager,
        context: Context,
        private type: ShapeType
    ) {
        super(shapeManager, context);
    }

    protected createStroke(point: Point) {
        this.startingPoint = point;
        return {
            id: UUID.generateString(),
            type: this.type,
            boundingBox: {
                lowerLeftPoint: point,
                upperRightPoint: point,
            },
            data: {
                strokeColor: '#000000ff',
                fillColor: '#cc0044ff',
            },
        };
    }

    protected updateStroke(activeStroke: BasicShape, point: Point) {
        return {
            ...activeStroke,
            boundingBox: createBoundingBox(this.startingPoint!, point),
        };
    }
}
