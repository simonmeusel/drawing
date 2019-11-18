export interface BoundingBox {
    maxX: number;
    minX: number;
    maxY: number;
    minY: number;
}

export function doBoundingBoxesOverlap(
    b1: BoundingBox,
    b2: BoundingBox
): boolean {
    return (
        b1.minX <= b2.maxX &&
        b2.maxX <= b1.maxX &&
        b1.minY <= b2.maxY &&
        b2.maxY <= b1.maxY
    );
}
