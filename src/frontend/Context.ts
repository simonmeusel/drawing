import {
    BoundingBox,
    doBoundingBoxesOverlap,
    createBoundingBox,
} from '../shared/BoundingBox';
import { Point } from '../shared/Point';

export class Context {
    public screen: BoundingBox = {
        lowerLeftPoint: { x: -1, y: -window.innerHeight / window.innerWidth },
        upperRightPoint: { x: 1, y: window.innerHeight / window.innerWidth },
    };

    private canvasWidthMultiplier: number = 1;
    private canvasHeightMultiplier: number = 1;

    public screenChangeHandler?: () => void;

    constructor(private c: CanvasRenderingContext2D) {
        this.recalculateRealWidthAndHeight();
    }

    public getWidth() {
        return this.screen.upperRightPoint.x - this.screen.lowerLeftPoint.x;
    }

    public getHeight() {
        return this.screen.upperRightPoint.y - this.screen.lowerLeftPoint.y;
    }

    private triggerScreenChangeHandler() {
        if (this.screenChangeHandler) {
            this.screenChangeHandler();
        }
    }
    /**
     * Translate screen in x direction
     */
    translateX(canvasXTranslation: number) {
        this.screen.lowerLeftPoint.x += canvasXTranslation;
        this.screen.upperRightPoint.x += canvasXTranslation;

        this.triggerScreenChangeHandler();
    }

    /**
     * Translate screen in y direction
     */
    translateY(canvasYTranslation: number) {
        this.screen.lowerLeftPoint.y += canvasYTranslation;
        this.screen.upperRightPoint.y += canvasYTranslation;

        this.triggerScreenChangeHandler();
    }

    /**
     * Translate in both directions
     */
    translateXY(canvasXTranslation, canvasYTranslation) {
        this.translateX(canvasXTranslation);
        this.translateY(canvasYTranslation);

        this.triggerScreenChangeHandler();
    }

    zoom(factor: number, centerX: number, centerY: number) {
        let zoomFactor = Math.pow(1.01, factor);

        const translationFactor = Math.abs(factor);

        // Calculate weighted average of canvas center point and mouse postion
        centerX =
            (centerX * translationFactor + (window.innerWidth / 2) * 100) /
            (100 + translationFactor);
        centerY =
            (centerY * translationFactor + (window.innerHeight / 2) * 100) /
            (100 + translationFactor);

        const anchorPoint = this.getPoint(centerX, centerY);

        const newWidth = this.getWidth() * zoomFactor;
        const newHeight = newWidth * (window.innerHeight / window.innerWidth);

        this.screen.lowerLeftPoint = {
            x: anchorPoint.x - newWidth / 2,
            y: anchorPoint.y - newHeight / 2,
        };

        this.screen.upperRightPoint = {
            x: anchorPoint.x + newWidth / 2,
            y: anchorPoint.y + newHeight / 2,
        };

        this.recalculateRealWidthAndHeight();

        this.triggerScreenChangeHandler();
    }

    recalculateRealWidthAndHeight() {
        this.canvasWidthMultiplier = window.innerWidth / this.getWidth();
        this.canvasHeightMultiplier = window.innerHeight / this.getHeight();
    }

    /**
     * Translates canvas coordinates to a point
     */
    getPoint(canvasX: number, canvasY: number): Point {
        return {
            x:
                this.screen.lowerLeftPoint.x +
                canvasX / this.canvasWidthMultiplier,
            y:
                this.screen.upperRightPoint.y -
                canvasY / this.canvasHeightMultiplier,
        };
    }

    /**
     * Calculates the canvas coordinates of a point
     */
    getCanvasCoordinates(point: Point): { x: number; y: number } {
        const x =
            (point.x - this.screen.lowerLeftPoint.x) *
            this.canvasWidthMultiplier;
        const y =
            (this.screen.upperRightPoint.y - point.y) *
            this.canvasHeightMultiplier;

        return { x, y };
    }

    clear() {
        this.c.fillStyle = 'black';
        this.c.clearRect(0, 0, this.c.canvas.width, this.c.canvas.height);
    }

    drawRectangle(
        boundingBox: BoundingBox,
        strokeColor: string,
        fillColor: string
    ) {
        if (!doBoundingBoxesOverlap(boundingBox, this.screen)) {
            return;
        }
        const lowerLeftCanvasPoint = this.getCanvasCoordinates(
            boundingBox.lowerLeftPoint
        );
        const upperRightCanvasPoint = this.getCanvasCoordinates(
            boundingBox.upperRightPoint
        );

        this.c.strokeStyle = strokeColor;
        this.c.fillStyle = fillColor;
        this.c.beginPath();
        const args: [number, number, number, number] = [
            lowerLeftCanvasPoint.x,
            lowerLeftCanvasPoint.y,
            upperRightCanvasPoint.x - lowerLeftCanvasPoint.x,
            upperRightCanvasPoint.y - lowerLeftCanvasPoint.y,
        ];
        this.c.strokeRect(...args);
        this.c.fillRect(...args);
    }

    drawEllipse(
        boundingBox: BoundingBox,
        strokeColor: string,
        fillColor: string
    ) {
        if (!doBoundingBoxesOverlap(boundingBox, this.screen)) {
            return;
        }

        const lowerLeftCanvasPoint = this.getCanvasCoordinates(
            boundingBox.lowerLeftPoint
        );
        const upperRightCanvasPoint = this.getCanvasCoordinates(
            boundingBox.upperRightPoint
        );

        const centerCanvasPoint = {
            x: (lowerLeftCanvasPoint.x + upperRightCanvasPoint.x) / 2,
            y: (lowerLeftCanvasPoint.y + upperRightCanvasPoint.y) / 2,
        };

        const radiusX = Math.abs(centerCanvasPoint.x - lowerLeftCanvasPoint.x);
        const radiusY = Math.abs(lowerLeftCanvasPoint.y - centerCanvasPoint.y);

        this.c.strokeStyle = strokeColor;
        this.c.fillStyle = fillColor;
        this.c.beginPath();
        this.c.ellipse(
            centerCanvasPoint.x,
            centerCanvasPoint.y,
            radiusX,
            radiusY,
            0,
            0,
            2 * Math.PI
        );
        this.c.stroke();
        this.c.fill();
    }

    drawLine(p1: Point, p2: Point, strokeColor: string) {
        if (!doBoundingBoxesOverlap(createBoundingBox(p1, p2), this.screen)) {
            return;
        }

        const canvasPoint1 = this.getCanvasCoordinates(p1);
        const canvasPoint2 = this.getCanvasCoordinates(p2);

        this.c.beginPath();
        this.c.strokeStyle = strokeColor;
        this.c.moveTo(canvasPoint1.x, canvasPoint1.y);
        this.c.lineTo(canvasPoint2.x, canvasPoint2.y);
        this.c.stroke();
    }
}
