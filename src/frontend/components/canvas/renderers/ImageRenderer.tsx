import { ImageShape } from '../../../../shared/shapes/ImageShape';
import { Graphics } from '../Graphics';

export class ImageRenderer {
    public draw(graphics: Graphics, shape: ImageShape) {
        console.log(shape.data.imageURL);
        graphics.drawImage(
            shape.data.imageURL,
            shape.boundingBox.lowerLeftPoint,
            shape.boundingBox.upperRightPoint
        );
    }
}
