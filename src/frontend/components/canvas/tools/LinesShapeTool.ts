import { addPointToBoundingBox } from '../../../../shared/BoundingBox';
import { Point } from '../../../../shared/Point';
import { LinesShape } from '../../../../shared/shapes/LinesShape';
import { UUID } from '../../../../shared/UUID';
import { ShapeTool } from './ShapeTool';
import { ToolProperties } from './Tool';

export class LinesShapeTool extends ShapeTool<LinesShape> {
    protected createShape(point: Point, toolProperties: ToolProperties) {
        const shape: LinesShape = {
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
        return shape;
    }

    protected updateShape(
        activeShape: LinesShape,
        point: Point,
        toolProperties: ToolProperties
    ) {
        return {
            ...activeShape,
            boundingBox: addPointToBoundingBox(activeShape.boundingBox, point),
            data: {
                points: [...activeShape.data.points, point],
                strokeColor: toolProperties.strokeColor,
            },
        };
    }
}
