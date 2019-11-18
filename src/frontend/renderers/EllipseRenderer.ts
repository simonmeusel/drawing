import { Renderer } from './Renderer';
import { Context } from '../Context';
import { Stroke } from '../../shared/Stroke';

export class EllipseRenderer extends Renderer {
    public draw(context: Context, stroke: Stroke) {
        context.drawEllipse(stroke.boundingBox);
    }
}
