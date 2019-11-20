import { Stroke } from '../shared/Stroke';
import { WebSocketManager } from './WebSocketManager';
import { Renderer } from './renderers/Renderer';
import { Context } from './Context';

export class StrokeManager {
    private strokes: { [strokeID: string]: Stroke } = {};
    private timeout?: any;

    public constructor(
        public webSocketManager: WebSocketManager,
        private context: Context,
        private strokeRenderers: {
            [type: string]: Renderer;
        }
    ) {
        webSocketManager.onStrokes = (strokes: Stroke[]) => {
            for (const stroke of strokes) {
                this.updateStrokeWithoutSending(stroke);
            }
            this.redraw();
        };
    }

    public updateStroke(stroke: Stroke) {
        this.updateStrokeWithoutSending(stroke);
        this.webSocketManager.updateStroke(stroke);
    }

    private updateStrokeWithoutSending(stroke: Stroke) {
        this.strokes[stroke.id] = stroke;
    }

    public deleteStroke(stroke: Stroke) {
        this.deleteStrokeWithoutSending(stroke);
        this.webSocketManager.deleteStroke(stroke.id);
    }

    public deleteStrokeWithoutSending(stroke: Stroke) {
        delete stroke[stroke.id];
    }

    public getStrokes() {
        return this.strokes;
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
        for (const strokeID in this.strokes) {
            const stroke = this.strokes[strokeID];
            this.strokeRenderers[stroke.type].draw(this.context, stroke);
        }
    }
}
