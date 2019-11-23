import { Point } from '../Point';
import { StrokedShape } from './StrokedShape';

export interface LinesStroke extends StrokedShape {
    data: {
        points: Point[];
        strokeColor: string;
    };
}
