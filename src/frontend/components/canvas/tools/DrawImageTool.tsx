import { addPointToBoundingBox } from '../../../../shared/BoundingBox';
import { Point } from '../../../../shared/Point';
import { ImageShape } from '../../../../shared/shapes/ImageShape';
import { UUID } from '../../../../shared/UUID';
import { ShapeTool } from './ShapeTool';
import { ToolProperties } from './Tool';

/**
 * When one clicks on the tool you get the image Path into the tool
 * */
export class DrawImageTool extends ShapeTool<ImageShape> {
    protected createShape(point: Point, toolProperties: ToolProperties) {
        const shape: ImageShape = {
            id: UUID.generateString(),
            type: 'image',
            boundingBox: {
                lowerLeftPoint: point,
                upperRightPoint: point,
            },
            data: {
                imageURL: toolProperties.imageUrl,
            },
        };
        return shape;
    }

    protected updateShape(
        activeShape: ImageShape,
        point: Point,
        _toolProperties: ToolProperties
    ) {
        return {
            ...activeShape,
            boundingBox: addPointToBoundingBox(activeShape.boundingBox, point),
            ...activeShape.data,
        };
    }
}
