import { Point } from '../Point';
import { StrokedShape } from './StrokedShape';

export interface LinesShape extends StrokedShape {
    data: {
        points: Point[];
        strokeColor: string;
    };
}
