import { Renderer } from './Renderer';
import { Context } from '../Context';
import { LinesStroke } from '../../shared/strokes/LinesStroke';
import { Point } from '../../shared/Point';

export class LinesRenderer extends Renderer {
    public draw(context: Context, stroke: LinesStroke) {
        let lastPoint: Point | undefined;
        for (const point of stroke.data.points) {
            if (lastPoint) {
                context.drawLine(lastPoint, point);
            }
            lastPoint = point;
        }
    }
}
