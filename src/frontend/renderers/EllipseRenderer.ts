import { Renderer } from './Renderer';
import { Context } from '../Context';
import { BasicShape } from '../../shared/strokes/BasicShape';

export class EllipseRenderer extends Renderer {
    public draw(context: Context, stroke: BasicShape) {
        context.drawEllipse(
            stroke.boundingBox,
            stroke.data.strokeColor,
            stroke.data.fillColor
        );
    }
}
