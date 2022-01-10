import { ImageUrl } from '../../frontend/components/canvas/tools/Tool';
import { GenericShape } from '../Shape';

export interface ImageShape extends GenericShape {
    type: 'image';
    data: {
        imageURL: ImageUrl;
    };
}
