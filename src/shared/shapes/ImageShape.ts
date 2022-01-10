import { GenericShape } from '../Shape';

export type ImageUrl = string;

export interface ImageShape extends GenericShape {
    type: 'image';
    data: {
        imageURL: ImageUrl;
    };
}
