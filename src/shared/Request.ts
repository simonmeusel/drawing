import { BoundingBox } from './BoundingBox';
import { Shape } from './Shape';

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
