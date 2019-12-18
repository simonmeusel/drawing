import { FilledShape } from './FilledShape';
import { StrokedShape } from './StrokedShape';

export interface BasicShape extends StrokedShape, FilledShape {
    type: 'ellipse' | 'rectangle';
    data: {
        strokeColor: string;
        fillColor: string;
    };
}
