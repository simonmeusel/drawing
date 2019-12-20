import { BasicShape } from '../../../../shared/shapes/BasicShape';
import { Graphics } from '../Graphics';
import { Renderer } from './Renderer';

export class EllipseRenderer extends Renderer<BasicShape> {
    public draw(graphics: Graphics, shape: BasicShape) {
        graphics.drawEllipse(
            shape.boundingBox,
            shape.data.strokeColor,
            shape.data.fillColor
        );
    }
}
