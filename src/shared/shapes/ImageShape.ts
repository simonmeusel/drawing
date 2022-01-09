import { Base64Encoded } from '../../frontend/components/canvas/Graphics';
import { BoundingBox } from '../BoundingBox';
import { GenericShape } from '../Shape';

export interface ImageShape extends GenericShape {
    type: 'image';
    data: {
        image_base64_encoded: Base64Encoded;
        bounding_box: BoundingBox;
    };
}
