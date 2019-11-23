import { Shape } from './Shape';
import { BoundingBox } from './BoundingBox';

export type Request =
    | {
          command: 'updateShape';
          oldBoundingBox: BoundingBox | undefined;
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
