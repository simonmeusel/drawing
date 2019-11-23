import { createBoundingBox } from '../../shared/BoundingBox';
import { StrokeType } from '../../shared/Stroke';
import { UUID } from '../../shared/UUID';
import { Point } from '../../shared/Point';
import { StrokeManager } from '../StrokeManager';
import { Context } from '../Context';
import { StrokeTool } from './StrokeTool';
import { BasicShape } from '../../shared/strokes/BasicShape';

export class BasicStrokeTool extends StrokeTool<BasicShape> {
    private startingPoint?: Point;

    constructor(
        strokeManager: StrokeManager,
        context: Context,
        private type: StrokeType
    ) {
        super(strokeManager, context);
    }

    protected createStroke(point: Point) {
        this.startingPoint = point;
        return {
            id: UUID.generateString(),
            type: this.type,
            boundingBox: {
                lowerLeftPoint: point,
                upperRightPoint: point,
            },
            data: {
                strokeColor: '#000000ff',
                fillColor: '#cc0044ff',
            },
        };
    }

    protected updateStroke(activeStroke: BasicShape, point: Point) {
        return {
            ...activeStroke,
            boundingBox: createBoundingBox(this.startingPoint!, point),
        };
    }
}
