import { BoundingBox } from './BoundingBox';
import { Shape } from './Shape';

export type Request =
    | {
          command: 'updateShape';
          shape: Shape;
      }
    | {
          command: 'deleteShape';
          shapeID: string;
      }
    | {
          command: 'setBoundingBox';
          boundingBox: BoundingBox;
      };
