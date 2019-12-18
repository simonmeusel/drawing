import { Point } from '../Point';
import { StrokedShape } from './StrokedShape';

export interface LinesShape extends StrokedShape {
    type: 'lines';
    data: {
        points: Point[];
        strokeColor: string;
    };
}
