import { ImageUrl } from '../ImageUrl';
import { GenericShape } from '../Shape';

export interface ImageShape extends GenericShape {
    type: 'image';
    data: {
        imageURL: ImageUrl;
    };
}
