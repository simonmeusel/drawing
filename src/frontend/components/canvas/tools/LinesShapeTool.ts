import { addPointToBoundingBox } from '../../../../shared/BoundingBox';
import { Point } from '../../../../shared/Point';
import { LinesShape } from '../../../../shared/shapes/LinesShape';
import { UUID } from '../../../../shared/UUID';
import { Context } from '../Context';
import { ShapeManager } from '../ShapeManager';
import { ShapeTool } from './ShapeTool';
import { ToolProperties } from './Tool';

export class LinesShapeTool extends ShapeTool<LinesShape> {
    constructor(strokeManager: ShapeManager, context: Context) {
        super(strokeManager, context);
    }

    protected createStroke(point: Point, toolProperties: ToolProperties) {
        const stroke: LinesShape = {
            id: UUID.generateString(),
            type: 'lines',
            boundingBox: {
                lowerLeftPoint: point,
                upperRightPoint: point,
            },
            data: {
                points: [point],
                strokeColor: toolProperties.strokeColor,
            },
        };
        return stroke;
    }

    protected updateStroke(
        activeStroke: LinesShape,
        point: Point,
        toolProperties: ToolProperties
    ) {
        return {
            ...activeStroke,
            boundingBox: addPointToBoundingBox(activeStroke.boundingBox, point),
            data: {
                points: [...activeStroke.data.points, point],
                strokeColor: toolProperties.strokeColor,
            },
        };
    }
}
