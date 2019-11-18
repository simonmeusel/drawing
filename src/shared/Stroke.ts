import { BoundingBox } from './BoundingBox';

export interface Stroke {
    id: string;
    boundingBox: BoundingBox;
    type: 'ellipse';
}
