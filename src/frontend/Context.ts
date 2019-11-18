import { BoundingBox } from '../shared/BoundingBox';

export class Context {
    screen: BoundingBox = {
        lowerLeftPoint: { x: 0, y: 0 },
        upperRightPoint: { x: 1, y: 1 },
    };

    constructor(private c: CanvasRenderingContext2D) {}

    zoom(factor: number) {}

    drawEllipse(boundingBox: BoundingBox) {}
}
