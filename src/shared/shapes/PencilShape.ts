import { Color } from '../Color';
import { Point } from '../Point';
import { StrokedShape } from './StrokedShape';

export interface PencilShape extends StrokedShape {
    type: 'pencil';
    data: {
        points: Point[];
        strokeColor: Color;
    };
}
