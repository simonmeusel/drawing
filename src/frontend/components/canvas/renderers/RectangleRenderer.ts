import { BasicShape } from '../../../../shared/shapes/BasicShape';
import { Graphics } from '../Graphics';
import { Renderer } from './Renderer';

export class RectangleRenderer extends Renderer<BasicShape> {
    public draw(graphics: Graphics, shape: BasicShape) {
        graphics.drawRectangle(
            shape.boundingBox,
            shape.data.strokeColor,
            shape.data.fillColor
        );
    }
}
