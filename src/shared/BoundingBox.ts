import { Point } from './Point';

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

export function addPointToBoundingBox(boundingBox: BoundingBox, point: Point) {
    return {
        lowerLeftPoint: {
            x: Math.min(boundingBox.lowerLeftPoint.x, point.x),
            y: Math.min(boundingBox.lowerLeftPoint.y, point.y),
        },
        upperRightPoint: {
            x: Math.max(boundingBox.upperRightPoint.x, point.x),
            y: Math.max(boundingBox.upperRightPoint.y, point.y),
        },
    };
}

export function doBoundingBoxesOverlap(
    b1: BoundingBox,
    b2: BoundingBox
): boolean {
    return (
        b1.upperRightPoint.x >= b2.lowerLeftPoint.x &&
        b2.upperRightPoint.x >= b1.lowerLeftPoint.x &&
        b1.upperRightPoint.y >= b2.lowerLeftPoint.y &&
        b2.upperRightPoint.y >= b1.lowerLeftPoint.y
    );
}

export function isPointInBoundingBox(
    boundingBox: BoundingBox,
    point: Point
): boolean {
    return doBoundingBoxesOverlap(boundingBox, {
        lowerLeftPoint: point,
        upperRightPoint: point,
    });
}

/**
 * Checks whether b2 is contained in b1
 */
export function isBoundingBoxContainer(
    b1: BoundingBox,
    b2: BoundingBox
): boolean {
    return (
        isPointInBoundingBox(b1, b2.lowerLeftPoint) &&
        isPointInBoundingBox(b1, b2.upperRightPoint)
    );
}

/**
 * Checks whether b2 is contained in b1 or equal to b1
 */
export function scaleBoundingBox(b1: BoundingBox, b2: BoundingBox): boolean {
    return (
        isPointInBoundingBox(b1, b2.lowerLeftPoint) &&
        isPointInBoundingBox(b1, b2.upperRightPoint)
    );
}
