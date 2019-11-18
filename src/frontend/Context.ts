import {
    BoundingBox,
    Point,
    doBoundingBoxesOverlap,
} from '../shared/BoundingBox';

export class Context {
    private screen: BoundingBox = {
        lowerLeftPoint: { x: 0, y: 0 },
        upperRightPoint: { x: window.innerWidth, y: window.innerHeight },
    };

    private realWidth: number = 1;
    private realHeight: number = 1;

    constructor(private c: CanvasRenderingContext2D) {}

    /**
     * translateX > 0 move right
     * translateX < 0 move left
     */
    translateX(translateX: number) {
        const width =
            this.screen.upperRightPoint.x - this.screen.lowerLeftPoint.x;
        const transWidth = (translateX / window.innerWidth) * width;

        this.screen.lowerLeftPoint.x += transWidth;
        this.screen.upperRightPoint.x += transWidth;
    }

    /**
     * translateY > 0 move up
     * translateY < 0 move down
     */
    translateY(translateY: number) {
        const height =
            this.screen.upperRightPoint.y - this.screen.lowerLeftPoint.y;
        const transHeight = (translateY / window.innerHeight) * height;

        this.screen.lowerLeftPoint.y += transHeight;
        this.screen.upperRightPoint.y += transHeight;
    }

    zoom(factor: number, centerX: number, centerY: number) {
        let currentScale = 1;
        if (factor < 0) {
            // Zoom in
            currentScale -= factor;
        } else {
            // Zoom out
            currentScale /= factor;
        }
        console.log(factor);

        // Moving the canvas bounding box
        this.screen.lowerLeftPoint.x =
            centerX -
            (this.screen.lowerLeftPoint.x - this.screen.upperRightPoint.x) /
                currentScale;
        this.screen.lowerLeftPoint.y =
            centerY -
            (this.screen.lowerLeftPoint.y - this.screen.upperRightPoint.y) /
                currentScale;
        this.screen.upperRightPoint.x =
            centerX +
            (this.screen.lowerLeftPoint.x - this.screen.upperRightPoint.x) /
                currentScale;
        this.screen.upperRightPoint.y =
            centerY +
            (this.screen.lowerLeftPoint.y - this.screen.upperRightPoint.y) /
                currentScale;

        // Change real Width and real Height
        this.realWidth =
            window.innerWidth /
            (this.screen.upperRightPoint.x - this.screen.lowerLeftPoint.x);
        this.realHeight =
            window.innerHeight /
            (this.screen.upperRightPoint.y - this.screen.lowerLeftPoint.x);
    }

    /**
     * Translates canvas coordinates to a point
     */
    getPoint(canvasX: number, canvasY: number): Point {
        let xCoordinate =
            this.screen.lowerLeftPoint.x + canvasX / this.realWidth;
        let yCoordinate =
            this.screen.lowerLeftPoint.y +
            (canvasY * -1 + window.innerHeight) / this.realHeight;
        return { x: xCoordinate, y: yCoordinate };
    }

    clear() {
        this.c.fillStyle = 'black';
        this.c.clearRect(0, 0, this.c.canvas.width, this.c.canvas.height);
    }

    drawEllipse(boundingBox: BoundingBox) {
        console.log('draw ellipse', boundingBox);
        console.log('draw ellipse screen', this.screen);

        if (!doBoundingBoxesOverlap(boundingBox, this.screen)) {
            console.log('not in screen');
        }

        // // if figure is too far right or too far over the screen
        // if (
        //     boundingBox.lowerLeftPoint.x > this.screen.upperRightPoint.x ||
        //     boundingBox.lowerLeftPoint.y < this.screen.upperRightPoint.y
        // ) {
        //     console.log('not in screen');
        //     return;
        // }
        // // if figure is too far left or too far under the screen
        // if (
        //     boundingBox.upperRightPoint.x < this.screen.lowerLeftPoint.x ||
        //     boundingBox.upperRightPoint.y > this.screen.lowerLeftPoint.y
        // ) {
        //     console.log('not in screen');
        //     return;
        // }

        const centerPointX =
            ((boundingBox.upperRightPoint.x + boundingBox.lowerLeftPoint.x) /
                2 +
                this.screen.lowerLeftPoint.x) *
            this.realWidth;
        const centerPointY =
            ((boundingBox.upperRightPoint.y + boundingBox.lowerLeftPoint.y) /
                2 +
                this.screen.lowerLeftPoint.y) *
            this.realHeight;

        console.log('center point ', centerPointX, centerPointY);

        const radiusX =
            (boundingBox.upperRightPoint.x - centerPointX / this.realWidth) *
            this.realWidth;
        const radiusY =
            (boundingBox.upperRightPoint.y - centerPointY / this.realHeight) *
            this.realHeight;

        console.log('radius ', radiusX, radiusY);

        console.log(
            centerPointX,
            this.getRealY(centerPointY),
            radiusX,
            radiusY
        );

        this.c.fillStyle = 'black';

        this.c.beginPath();
        this.c.ellipse(
            centerPointX,
            this.getRealY(centerPointY),
            radiusX,
            radiusY,
            0,
            0,
            2 * Math.PI
        );
        this.c.fill();
    }

    getRealY(coordinateY: number) {
        coordinateY *= -1;
        return coordinateY + window.innerHeight;
    }
}
