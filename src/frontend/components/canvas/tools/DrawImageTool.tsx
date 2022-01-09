import { createBoundingBox } from '../../../../shared/BoundingBox';
import { Point } from '../../../../shared/Point';
import { ImageShape } from '../../../../shared/shapes/ImageShape';
import { UUID } from '../../../../shared/UUID';
import { ShapeTool } from './ShapeTool';
import { ToolProperties } from './Tool';

/**
 * When one clicks on the tool you get the image Path into the tool
 * */
export class DrawImageTool extends ShapeTool<ImageShape> {
    private startingPoint?: Point;


    protected createShape(point: Point, toolProperties: ToolProperties) {
        this.startingPoint = point;
        return {
            id: UUID.generateString(),
            type: 'image' as const,
            boundingBox: {
                lowerLeftPoint: point,
                upperRightPoint: point,
            },
            data: {
                imageURL: toolProperties.imageUrl,
            },
        };
    }

    protected updateShape(
        activeShape: ImageShape,
        point: Point,
        toolProperties: ToolProperties
    ) {
        return {
            ...activeShape,
            data: {
                imageURL: toolProperties.imageUrl,
            },
            boundingBox: createBoundingBox(this.startingPoint!, point),
        };
    }
}
