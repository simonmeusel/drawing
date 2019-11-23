import { Shape, ShapeType } from '../shared/Shape';
import { WebSocketManager } from './WebSocketManager';
import { Renderer } from './renderers/Renderer';
import { Context } from './Context';

export class ShapeManager {
    private shapes: { [shapeID: string]: Shape } = {};
    private timeout?: any;

    public constructor(
        public webSocketManager: WebSocketManager,
        private context: Context,
        private shapeRenderers: Record<ShapeType, Renderer<any>>
    ) {
        webSocketManager.onShapes = (strokes: Shape[]) => {
            for (const stroke of strokes) {
                this.updateStrokeWithoutSending(stroke);
            }
            this.redraw();
        };
    }

    public updateStroke(stroke: Shape) {
        this.updateStrokeWithoutSending(stroke);
        this.webSocketManager.updateShape(stroke);
    }

    private updateStrokeWithoutSending(stroke: Shape) {
        this.shapes[stroke.id] = stroke;
    }

    public deleteStroke(stroke: Shape) {
        this.deleteStrokeWithoutSending(stroke);
        this.webSocketManager.deleteShape(stroke.id);
    }

    public deleteStrokeWithoutSending(stroke: Shape) {
        delete stroke[stroke.id];
    }

    public getStrokes() {
        return this.shapes;
    }

    public redraw() {
        if (this.timeout) {
            return;
        }
        this.timeout = setTimeout(() => {
            this.timeout = undefined;
            this.redrawStrokes();
        }, 0);
    }

    private redrawStrokes() {
        this.context.clear();
        for (const shapeID in this.shapes) {
            const shape = this.shapes[shapeID];
            this.shapeRenderers[shape.type].draw(this.context, shape);
        }
    }
}
