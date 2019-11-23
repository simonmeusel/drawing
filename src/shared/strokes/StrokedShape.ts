import { Stroke } from '../Stroke';

export interface StrokedShape extends Stroke {
    data: {
        strokeColor: string;
    };
}
