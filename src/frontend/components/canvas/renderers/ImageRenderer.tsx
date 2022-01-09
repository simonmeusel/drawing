import { ImageShape } from '../../../../shared/shapes/ImageShape';
import { Graphics } from '../Graphics';

export class ImageRenderer {
    public draw(graphics: Graphics, shape: ImageShape) {
        graphics.drawImage(
            shape.data.image_base64_encoded,
            shape.data.bounding_box.lowerLeftPoint,
            shape.data.bounding_box.upperRightPoint
        );
    }
}
