import { BoundingBox } from './BoundingBox';
import { Point } from './Point';
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
      }
    | {
          command: 'setMousePosition';
          // TODO: Add JSON schema validator: UUID
          mouseID: string;
          mousePosition: Point;
      };
