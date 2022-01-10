import { GenericShape } from '../Shape';

export type Base64Encoded = string;

export interface ImageShape extends GenericShape {
    type: 'image';
    data: {
        imageURL: Base64Encoded;
    };
}
