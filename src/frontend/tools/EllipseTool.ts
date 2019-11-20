import { Tool } from './Tool';
import { createBoundingBox } from '../../shared/BoundingBox';
import { Stroke } from '../../shared/Stroke';
import { UUID } from '../../shared/UUID';
import { Point } from '../../shared/Point';

export class EllipseTool extends Tool {
    private activeStroke?: Stroke;
    private startingPoint?: Point;

    onMouseDown(point: Point) {
        if (this.activeStroke) {
            return;
        }
        this.startingPoint = point;
        this.activeStroke = {
            id: UUID.generateString(),
            type: 'ellipse',
            boundingBox: {
                lowerLeftPoint: point,
                upperRightPoint: point,
            },
        };
        this.strokeManager.addStrokes([this.activeStroke]);
    }

    onMouseMove(point: Point) {
        if (!this.activeStroke) {
            return;
        }
        this.activeStroke.boundingBox = createBoundingBox(
            this.startingPoint!,
            point
        );
        this.strokeManager.redraw();
    }

    onMouseUp(point: Point) {
        if (!this.activeStroke) {
            return;
        }
        this.onMouseMove(point);
        this.activeStroke = undefined;
        this.startingPoint = undefined;
    }
}
