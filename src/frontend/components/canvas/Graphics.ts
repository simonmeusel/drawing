import {
    BoundingBox,
    createBoundingBox,
    doBoundingBoxesOverlap,
} from '../../../shared/BoundingBox';
import { Point } from '../../../shared/Point';
import { WebSocketManager } from '../../api/WebSocketManager';
import { Screen } from '../../store/initialState';

export class Graphics {
    /**
     * Screen bounding box
     */
    public sbb: BoundingBox = {
        lowerLeftPoint: { x: 0, y: 0 },
        upperRightPoint: { x: 0, y: 0 },
    };

    private canvas: HTMLCanvasElement;
    private canvasWidthMultiplier: number = 1;
    private canvasHeightMultiplier: number = 1;

    constructor(
        private c: CanvasRenderingContext2D,
        initialScreen: Screen,
        private webSocketManager: WebSocketManager
    ) {
        this.canvas = c.canvas;
        this.setScreen(initialScreen);
    }

    public getWidth() {
        return this.sbb.upperRightPoint.x - this.sbb.lowerLeftPoint.x;
    }

    public getHeight() {
        return this.sbb.upperRightPoint.y - this.sbb.lowerLeftPoint.y;
    }

    public setScreen(screen: Screen) {
        const aspectRatio = this.canvas.clientHeight / this.canvas.clientWidth;
        const d = screen.width / 2;
        this.sbb = {
            lowerLeftPoint: {
                x: -d + screen.centerPoint.x,
                y: -aspectRatio * d + screen.centerPoint.y,
            },
            upperRightPoint: {
                x: d + screen.centerPoint.x,
                y: aspectRatio * d + screen.centerPoint.y,
            },
        };
        this.webSocketManager.setScreenBoundingBox(this.sbb);
        this.recalculateRealWidthAndHeight();
    }

    recalculateRealWidthAndHeight() {
        this.canvasWidthMultiplier = this.canvas.clientWidth / this.getWidth();
        this.canvasHeightMultiplier =
            this.canvas.clientHeight / this.getHeight();
    }

    /**
     * Translates canvas coordinates to a point
     */
    getPoint(canvasX: number, canvasY: number): Point {
        return {
            x: this.sbb.lowerLeftPoint.x + canvasX / this.canvasWidthMultiplier,
            y:
                this.sbb.upperRightPoint.y -
                canvasY / this.canvasHeightMultiplier,
        };
    }

    /**
     * Calculates the canvas coordinates of a point
     */
    getCanvasCoordinates(point: Point): { x: number; y: number } {
        const x =
            (point.x - this.sbb.lowerLeftPoint.x) * this.canvasWidthMultiplier;
        const y =
            (this.sbb.upperRightPoint.y - point.y) *
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
        if (!doBoundingBoxesOverlap(boundingBox, this.sbb)) {
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
        if (!doBoundingBoxesOverlap(boundingBox, this.sbb)) {
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
        if (!doBoundingBoxesOverlap(createBoundingBox(p1, p2), this.sbb)) {
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
