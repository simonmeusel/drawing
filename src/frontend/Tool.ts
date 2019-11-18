export abstract class Tool {
    abstract onMouseDown();
    abstract onMouseMove();
    abstract onMouseUp();
}

export class EllipseTool extends Tool {
    isMouseDown = false;

    onMouseDown() {
        this.isMouseDown = true;
    }

    onMouseMove() {}

    onMouseUp() {
        this.isMouseDown = false;
    }
}
