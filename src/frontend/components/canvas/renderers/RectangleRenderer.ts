import { BasicShape } from '../../../../shared/shapes/BasicShape';
import { Context } from '../Context';
import { Renderer } from './Renderer';

export class RectangleRenderer extends Renderer<BasicShape> {
    public draw(context: Context, shape: BasicShape) {
        context.drawRectangle(
            shape.boundingBox,
            shape.data.strokeColor,
            shape.data.fillColor
        );
    }
}
