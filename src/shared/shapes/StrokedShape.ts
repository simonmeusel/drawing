import { Shape } from '../Shape';

export interface StrokedShape extends Shape {
    data: {
        strokeColor: string;
    };
}
