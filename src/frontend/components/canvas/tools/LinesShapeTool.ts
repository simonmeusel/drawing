import { addPointToBoundingBox } from '../../../../shared/BoundingBox';
import { UUID } from '../../../../shared/UUID';
import { Point } from '../../../../shared/Point';
import { ShapeManager } from '../ShapeManager';
import { Context } from '../Context';
import { ShapeTool } from './ShapeTool';
import { LinesShape } from '../../../../shared/shapes/LinesShape';

export class LinesShapeTool extends ShapeTool<LinesShape> {
    constructor(strokeManager: ShapeManager, context: Context) {
        super(strokeManager, context);
    }

    protected createStroke(point: Point) {
        const stroke: LinesShape = {
            id: UUID.generateString(),
            type: 'lines',
            boundingBox: {
                lowerLeftPoint: point,
                upperRightPoint: point,
            },
            data: {
                points: [point],
                strokeColor: '#4400ccff',
            },
        };
        return stroke;
    }

    protected updateStroke(activeStroke: LinesShape, point: Point) {
        return {
            ...activeStroke,
            boundingBox: addPointToBoundingBox(activeStroke.boundingBox, point),
            data: {
                points: [...activeStroke.data.points, point],
                strokeColor: activeStroke.data.strokeColor,
            },
        };
    }
}
