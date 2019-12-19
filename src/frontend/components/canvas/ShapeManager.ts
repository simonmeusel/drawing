import { Shape, ShapeType } from '../../../shared/Shape';
import { Context } from './Context';
import { Renderer } from './renderers/Renderer';
import { WebSocketManager } from './WebSocketManager';

export class ShapeManager {
    private shapes: { [shapeID: string]: Shape } = {};
    private timeout?: any;

    public constructor(
        public webSocketManager: WebSocketManager,
        private context: Context,
        private shapeRenderers: Record<ShapeType, Renderer<any>>
    ) {
        webSocketManager.onShapes = (shapes: Shape[]) => {
            for (const shape of shapes) {
                this.updateShapeWithoutSending(shape);
            }
            this.redraw();
        };
    }

    public updateShape(shape: Shape) {
        this.updateShapeWithoutSending(shape);
        this.webSocketManager.updateShape(shape);
    }

    private updateShapeWithoutSending(shape: Shape) {
        this.shapes[shape.id] = shape;
    }

    public deleteShape(shape: Shape) {
        this.deleteShapeWithoutSending(shape);
        this.webSocketManager.deleteShape(shape.id);
    }

    public deleteShapeWithoutSending(shape: Shape) {
        delete this.shapes[shape.id];
    }

    public getShapes() {
        return this.shapes;
    }

    public redraw() {
        if (this.timeout) {
            return;
        }
        this.timeout = setTimeout(() => {
            this.timeout = undefined;
            this.redrawShapes();
        }, 0);
    }

    private redrawShapes() {
        this.context.clear();
        for (const shapeID in this.shapes) {
            const shape = this.shapes[shapeID];
            this.shapeRenderers[shape.type].draw(this.context, shape);
        }
    }
}
