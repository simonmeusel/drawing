import { addPointToBoundingBox } from '../../../../shared/BoundingBox';
import { Point } from '../../../../shared/Point';
import { PencilShape } from '../../../../shared/shapes/PencilShape';
import { UUID } from '../../../../shared/UUID';
import { ShapeTool } from './ShapeTool';
import { ToolProperties } from './Tool';

export class PencilShapeTool extends ShapeTool<PencilShape> {
    protected createShape(point: Point, toolProperties: ToolProperties) {
        const shape: PencilShape = {
            id: UUID.generateString(),
            type: 'pencil',
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
        activeShape: PencilShape,
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
