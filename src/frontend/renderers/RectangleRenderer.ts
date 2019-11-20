import { Renderer } from './Renderer';
import { Context } from '../Context';
import { Stroke } from '../../shared/Stroke';

export class RectangleRenderer extends Renderer {
    public draw(context: Context, stroke: Stroke) {
        context.drawRectangle(stroke.boundingBox);
    }
}
