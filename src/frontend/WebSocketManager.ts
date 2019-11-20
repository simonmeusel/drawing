import { Stroke } from '../shared/Stroke';
import { Request } from '../shared/Request';
import { BoundingBox } from '../shared/BoundingBox';
import { Context } from './Context';

export class WebSocketManager {
    webSocket: WebSocket;
    onStrokes?: (strokes: Stroke[]) => void;

    constructor(uri: string, private context: Context) {
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

    addStrokes(strokes: Stroke[]) {
        this.sendRequest({
            command: 'addStrokes',
            strokes,
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
