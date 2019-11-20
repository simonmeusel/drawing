import { BoundingBox, doBoundingBoxesOverlap } from '../shared/BoundingBox';
import { Point } from '../shared/Point';

export class Context {
    private screen: BoundingBox = {
        lowerLeftPoint: { x: -1, y: -window.innerHeight / window.innerWidth },
        upperRightPoint: { x: 1, y: window.innerHeight / window.innerWidth },
    };

    private realWidth: number = 1;
    private realHeight: number = 1;

    constructor(private c: CanvasRenderingContext2D) {
        this.recalculateRealWidthAndHeight();
    }

    /**
     * translateX > 0 move right
     * translateX < 0 move left
     */
    /*translateX(translateX: number) {
        const width =
            this.screen.upperRightPoint.x - this.screen.lowerLeftPoint.x;
        const transWidth = (translateX / window.innerWidth) * width;

        this.screen.lowerLeftPoint.x += transWidth;
        this.screen.upperRightPoint.x += transWidth;
    }*/

    /**
     * translateY > 0 move up
     * translateY < 0 move down
     */
    /*translateY(translateY: number) {
        const height =
            this.screen.upperRightPoint.y - this.screen.lowerLeftPoint.y;
        const transHeight = (translateY / window.innerHeight) * height;

        this.screen.lowerLeftPoint.y += transHeight;
        this.screen.upperRightPoint.y += transHeight;
    }*/

    zoom(factor: number, centerX: number, centerY: number) {
        centerX = (centerX + window.innerWidth / 2) / 2;
        centerY = (centerY + window.innerHeight / 2) / 2;

        let zoomFactor = 0;
        if (factor < 0) {
            // Zoom in
            zoomFactor = 1.1;
        } else {
            // Zoom out
            zoomFactor = 0.9;
        }

        const anchorPoint = this.getPoint(centerX, centerY);

        const newWidth =
            (this.screen.upperRightPoint.x - this.screen.lowerLeftPoint.x) /
            zoomFactor;
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
    }

    recalculateRealWidthAndHeight() {
        this.realWidth =
            window.innerWidth /
            (this.screen.upperRightPoint.x - this.screen.lowerLeftPoint.x);
        this.realHeight =
            window.innerHeight /
            (this.screen.upperRightPoint.y - this.screen.lowerLeftPoint.y);
    }

    /**
     * Translates canvas coordinates to a point
     */
    getPoint(canvasX: number, canvasY: number): Point {
        return {
            x: this.screen.lowerLeftPoint.x + canvasX / this.realWidth,
            y: this.screen.upperRightPoint.y - canvasY / this.realHeight,
        };
    }

    /**
     * Calculates the canvas coordinates of a point
     */
    getCanvasCoordinates(point: Point): { x: number; y: number } {
        const x = (point.x - this.screen.lowerLeftPoint.x) * this.realWidth;
        const y = (this.screen.upperRightPoint.y - point.y) * this.realHeight;

        return { x, y };
    }

    clear() {
        this.c.fillStyle = 'black';
        this.c.clearRect(0, 0, this.c.canvas.width, this.c.canvas.height);
    }

    drawEllipse(boundingBox: BoundingBox) {
        if (!doBoundingBoxesOverlap(boundingBox, this.screen)) {
            console.log('not in screen');
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

        this.c.fillStyle = 'black';

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
        this.c.fill();
    }
}
