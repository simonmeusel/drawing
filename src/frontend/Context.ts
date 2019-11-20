import { BoundingBox, doBoundingBoxesOverlap } from '../shared/BoundingBox';
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

    private triggerScreenChangeHandler() {
        if (this.screenChangeHandler) {
            this.screenChangeHandler();
        }
    }
    /**
     * Translate screen in x direction
     */
    translateX(canvasXTranslation: number) {
        const width =
            this.screen.upperRightPoint.x - this.screen.lowerLeftPoint.x;
        const transWidth = (canvasXTranslation / window.innerWidth) * width;

        this.screen.lowerLeftPoint.x += transWidth;
        this.screen.upperRightPoint.x += transWidth;

        this.triggerScreenChangeHandler();
    }

    /**
     * Translate screen in y direction
     */
    translateY(canvasYTranslation: number) {
        const height =
            this.screen.upperRightPoint.y - this.screen.lowerLeftPoint.y;
        const transHeight = (canvasYTranslation / window.innerHeight) * height;

        this.screen.lowerLeftPoint.y += transHeight;
        this.screen.upperRightPoint.y += transHeight;

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

        const newWidth =
            (this.screen.upperRightPoint.x - this.screen.lowerLeftPoint.x) *
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

        this.triggerScreenChangeHandler();
    }

    recalculateRealWidthAndHeight() {
        this.canvasWidthMultiplier =
            window.innerWidth /
            (this.screen.upperRightPoint.x - this.screen.lowerLeftPoint.x);
        this.canvasHeightMultiplier =
            window.innerHeight /
            (this.screen.upperRightPoint.y - this.screen.lowerLeftPoint.y);
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

    drawRectangle(boundingBox: BoundingBox) {
        if (!doBoundingBoxesOverlap(boundingBox, this.screen)) {
            console.warn('no overlap');
            //return;
        }
        const lowerLeftCanvasPoint = this.getCanvasCoordinates(
            boundingBox.lowerLeftPoint
        );
        const upperRightCanvasPoint = this.getCanvasCoordinates(
            boundingBox.upperRightPoint
        );

        this.c.beginPath();
        this.c.fillRect(
            lowerLeftCanvasPoint.x,
            lowerLeftCanvasPoint.y,
            upperRightCanvasPoint.x - lowerLeftCanvasPoint.x,
            upperRightCanvasPoint.y - lowerLeftCanvasPoint.y
        );
    }

    drawEllipse(boundingBox: BoundingBox) {
        if (!doBoundingBoxesOverlap(boundingBox, this.screen)) {
            console.warn('no overlap');

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
