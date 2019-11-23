import { Stroke } from '../Stroke';

export interface FilledShape extends Stroke {
    data: {
        fillColor: string;
    };
}
