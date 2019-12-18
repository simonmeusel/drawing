import { GenericShape } from '../Shape';

export interface StrokedShape extends GenericShape {
    data: {
        strokeColor: string;
    };
}
