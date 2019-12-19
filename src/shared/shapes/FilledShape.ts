import { GenericShape } from '../Shape';

export interface FilledShape extends GenericShape {
    data: {
        fillColor: string;
    };
}
