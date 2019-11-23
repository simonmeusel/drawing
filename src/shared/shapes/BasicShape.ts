import { FilledShape } from './FilledShape';
import { StrokedShape } from './StrokedShape';

export interface BasicShape extends StrokedShape, FilledShape {
    data: {
        strokeColor: string;
        fillColor: string;
    };
}
