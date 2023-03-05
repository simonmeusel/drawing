import { Color } from '../Color';
import { FilledShape } from './FilledShape';
import { StrokedShape } from './StrokedShape';

export type BasicShapeType = 'ellipse' | 'rectangle';

export interface BasicShape extends StrokedShape, FilledShape {
    type: BasicShapeType;
    data: {
        strokeColor: Color;
        fillColor: Color;
    };
}
