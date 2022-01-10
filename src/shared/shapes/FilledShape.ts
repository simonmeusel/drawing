import { Color } from '../Color';
import { GenericShape } from '../Shape';

export interface FilledShape extends GenericShape {
    data: {
        fillColor: Color;
    };
}
