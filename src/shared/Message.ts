import { Point } from './Point';
import { Shape } from './Shape';

export type Message =
    | {
          command: 'updateShapes';
          shapes: Shape[];
      }
    | {
          command: 'deleteShape';
          shapeID: string;
      }
    | {
          command: 'setMousePosition';
          mouseID: string;
          mousePosition: Point;
      };
