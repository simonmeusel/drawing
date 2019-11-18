export interface Point {
    x: number;
    y: number;
}

export interface BoundingBox {
    lowerLeftPoint: Point;
    upperRightPoint: Point;
}

export function createBoundingBox(p1: Point, p2: Point): BoundingBox {
    return {
        lowerLeftPoint: {
            x: Math.min(p1.x, p2.x),
            y: Math.min(p1.y, p2.y),
        },
        upperRightPoint: {
            x: Math.max(p1.x, p2.x),
            y: Math.max(p1.y, p2.y),
        },
    };
}

export function doBoundingBoxesOverlap(
    b1: BoundingBox,
    b2: BoundingBox
): boolean {
    return (
        b1.upperRightPoint.x > b2.lowerLeftPoint.x &&
        b2.upperRightPoint.x > b1.lowerLeftPoint.x &&
        b1.upperRightPoint.y > b2.lowerLeftPoint.y &&
        b2.upperRightPoint.y > b1.lowerLeftPoint.y
    );
}
