import { Renderer } from './Renderer';
import { Context } from '../Context';
import { BasicShape } from '../../../../shared/shapes/BasicShape';

export class EllipseRenderer extends Renderer<BasicShape> {
    public draw(context: Context, shape: BasicShape) {
        context.drawEllipse(
            shape.boundingBox,
            shape.data.strokeColor,
            shape.data.fillColor
        );
    }
}
