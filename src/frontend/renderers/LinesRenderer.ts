import { Renderer } from './Renderer';
import { Context } from '../Context';
import { LinesShape } from '../../shared/shapes/LinesShape';
import { Point } from '../../shared/Point';

export class LinesRenderer extends Renderer<LinesShape> {
    public draw(context: Context, shape: LinesShape) {
        let lastPoint: Point | undefined;
        for (const point of shape.data.points) {
            if (lastPoint) {
                context.drawLine(lastPoint, point, shape.data.strokeColor);
            }
            lastPoint = point;
        }
    }
}
