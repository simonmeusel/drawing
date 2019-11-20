import { Stroke } from '../shared/Stroke';
import { Request } from '../shared/Request';
import { BoundingBox } from '../shared/BoundingBox';
import { Context } from './Context';

export class WebSocketManager {
    private webSocket: WebSocket;
    onStrokes?: (strokes: Stroke[]) => void;

    private debouncedStrokes: {
        [strokeID: string]: {
            stroke: Stroke;
            oldBoundingBox?: BoundingBox;
            timeout: any;
        };
    } = {};

    constructor(
        uri: string,
        private context: Context,
        private debounceDelay = 100
    ) {
        this.webSocket = new WebSocket(uri);
        this.webSocket.addEventListener('open', () => {
            console.log('Web socket connected');
            this.onScreenChange();
        });
        this.webSocket.addEventListener('message', event => {
            this.onMessage(event);
        });
        context.screenChangeHandler = () => {
            this.onScreenChange();
        };
    }

    onScreenChange() {
        this.setBoundingBox(this.context.screen);
    }

    onMessage(event: MessageEvent) {
        if (this.onStrokes) {
            const strokes: Stroke[] = JSON.parse(event.data);
            this.onStrokes(strokes);
        }
    }

    updateStroke(stroke: Stroke, oldBoundingBox?: BoundingBox) {
        if (this.debouncedStrokes[stroke.id]) {
            this.debouncedStrokes[stroke.id].stroke = stroke;
        } else {
            this.debouncedStrokes[stroke.id] = {
                stroke,
                oldBoundingBox,
                timeout: setTimeout(() => {
                    console.log('update sent');
                    this.sendRequest({
                        command: 'updateStroke',
                        oldBoundingBox,
                        stroke,
                    });
                    delete this.debouncedStrokes[stroke.id];
                }, this.debounceDelay),
            };
        }
    }

    deleteStroke(strokeID: string) {
        if (this.debouncedStrokes[strokeID]) {
            clearTimeout(this.debouncedStrokes[strokeID].timeout);
            delete this.debouncedStrokes[strokeID];
        }
        this.sendRequest({
            command: 'deleteStroke',
            strokeID,
        });
    }

    setBoundingBox(boundingBox: BoundingBox) {
        this.sendRequest({
            command: 'setBoundingBox',
            boundingBox: boundingBox,
        });
    }

    sendRequest(request: Request) {
        this.webSocket.send(JSON.stringify(request));
    }
}
