import { Shape } from '../Shape';

export interface FilledShape extends Shape {
    data: {
        fillColor: string;
    };
}
