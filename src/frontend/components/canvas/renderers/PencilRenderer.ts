import { Point } from '../../../../shared/Point';
import { PencilShape } from '../../../../shared/shapes/PencilShape';
import { Graphics } from '../Graphics';
import { Renderer } from './Renderer';

export class PencilRenderer extends Renderer<PencilShape> {
    public m = 1;

    constructor() {
        super();
    }
    public draw(graphics: Graphics, shape: PencilShape) {
        let lastPoint: Point | undefined;
        for (const point of this.smoothPoints(shape.data.points, this.m)) {
            if (lastPoint) {
                graphics.drawLine(lastPoint, point, shape.data.strokeColor);
            }
            lastPoint = point;
        }
    }

    public smoothPoints(points: Point[], smoothingAmount: number) {
        if (points.length < 3) {
            return points;
        }
        smoothingAmount = Math.min(
            smoothingAmount,
            points.length / 2 - ((points.length / 2 + 1) % 2)
        );
        if (smoothingAmount % 2 != 1) {
            throw new Error('Smoothing amount is even.');
        }
        const newPoints = new Array(points.length);
        newPoints[0] = points[0];
        newPoints[points.length - 1] = points[points.length - 1];
        let xSum = points[0].x;
        let ySum = points[0].y;
        let a = 1;
        let starting = true;
        for (let i = 1; i < points.length - 1; i++) {
            if (starting && a < smoothingAmount) {
                xSum += points[i + Math.floor(a / 2)].x;
                xSum += points[i + Math.ceil(a / 2)].x;
                ySum += points[i + Math.floor(a / 2)].y;
                ySum += points[i + Math.ceil(a / 2)].y;
                a += 2;
            } else if (i + Math.ceil(a / 2) <= points.length - 1) {
                starting = false;
                xSum += points[i + Math.floor(a / 2)].x;
                ySum += points[i + Math.floor(a / 2)].y;
                xSum -= points[i - Math.ceil(a / 2)].x;
                ySum -= points[i - Math.ceil(a / 2)].y;
            } else {
                xSum -= points[i - Math.floor(a / 2)].x;
                xSum -= points[i - Math.ceil(a / 2)].x;
                ySum -= points[i - Math.floor(a / 2)].y;
                ySum -= points[i - Math.ceil(a / 2)].y;
                a -= 2;
            }
            newPoints[i] = {
                x: xSum / a,
                y: ySum / a,
            };
        }

        return newPoints;
    }

    public getPoint(points: Point[], i: number) {
        if (i < 0) {
            return points[0];
        }
        if (i > points.length - 1) {
            return points[points.length - 1];
        }
        return points;
    }
}
