import { Stroke } from '../Stroke';
import { Point } from '../Point';

export interface LinesStroke extends Stroke {
    data: {
        points: Point[];
    };
}
