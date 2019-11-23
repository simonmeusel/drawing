import { addPointToBoundingBox } from '../../shared/BoundingBox';
import { UUID } from '../../shared/UUID';
import { Point } from '../../shared/Point';
import { StrokeManager } from '../StrokeManager';
import { Context } from '../Context';
import { StrokeTool } from './StrokeTool';
import { LinesStroke } from '../../shared/strokes/LinesStroke';

export class LinesTool extends StrokeTool<LinesStroke> {
    constructor(strokeManager: StrokeManager, context: Context) {
        super(strokeManager, context);
    }

    protected createStroke(point: Point) {
        const stroke: LinesStroke = {
            id: UUID.generateString(),
            type: 'lines',
            boundingBox: {
                lowerLeftPoint: point,
                upperRightPoint: point,
            },
            data: {
                points: [point],
            },
        };
        return stroke;
    }

    protected updateStroke(activeStroke: LinesStroke, point: Point) {
        return {
            ...activeStroke,
            boundingBox: addPointToBoundingBox(activeStroke.boundingBox, point),
            data: {
                points: activeStroke.data.points.concat([point]),
            },
        };
    }
}
