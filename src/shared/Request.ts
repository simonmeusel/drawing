import { Stroke } from './Stroke';
import { BoundingBox } from './BoundingBox';

export type Request =
    | {
          command: 'updateStroke';
          oldBoundingBox: BoundingBox | undefined;
          stroke: Stroke;
      }
    | {
          command: 'deleteStroke';
          strokeID: string;
      }
    | {
          command: 'setBoundingBox';
          boundingBox: BoundingBox;
      };
