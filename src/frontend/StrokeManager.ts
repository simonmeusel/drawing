import { Stroke } from '../shared/Stroke';
import { WebSocketManager } from './WebSocketManager';
import { Renderer } from './renderers/Renderer';
import { Context } from './Context';

export class StrokeManager {
    private strokes: Stroke[] = [];
    private timeout?: any;

    public constructor(
        private webSocketManager: WebSocketManager,
        private context: Context,
        private strokeRenderers: {
            [type: string]: Renderer;
        }
    ) {
        webSocketManager.onStrokes = (strokes: Stroke[]) => {
            this.addStrokesWithoutSending(strokes);
        };
    }

    public addStrokes(strokes: Stroke[]) {
        this.addStrokesWithoutSending(strokes);
        this.webSocketManager.addStrokes(strokes);
        this.redraw();
    }

    private addStrokesWithoutSending(strokes: Stroke[]) {
        for (const stroke of strokes) {
            this.strokes.push(stroke);
        }
    }

    public removeStrokes(strokes: Stroke[]) {
        for (const stroke of strokes) {
            this.strokes.splice(this.strokes.indexOf(stroke), 1);
        }
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
        for (const stroke of this.strokes) {
            this.strokeRenderers[stroke.type].draw(this.context, stroke);
        }
    }
}
