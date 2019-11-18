export interface Point {
    x: number;
    y: number;
}

export interface BoundingBox {
    upperRightPoint: Point;
    lowerLeftPoint: Point;
}

export function doBoundingBoxesOverlap(
    b1: BoundingBox,
    b2: BoundingBox
): boolean {
    return (
        b1.upperRightPoint.x <= b2.lowerLeftPoint.x &&
        b2.upperRightPoint.x <= b1.lowerLeftPoint.x &&
        b1.upperRightPoint.y <= b2.lowerLeftPoint.y &&
        b2.upperRightPoint.y <= b1.lowerLeftPoint.y
    );
}
