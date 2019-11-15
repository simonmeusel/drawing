import { Stroke } from './Stroke';
import { BoundingBox } from './BoundingBox';

export type Request =
    | {
          command: 'addStrokes';
          strokes: Stroke[];
      }
    | {
          command: 'setBoundingBox';
          boundingBox: BoundingBox;
      };
