import { Stroke } from '../shared/Stroke';
import { Request } from '../shared/Request';
import { BoundingBox } from '../shared/BoundingBox';

export class WebSocketManager {
    webSocket: WebSocket;
    onStrokes?: (strokes: Stroke[]) => void;

    constructor(uri: string) {
        this.webSocket = new WebSocket(uri);
        this.webSocket.addEventListener('open', () => {
            console.log('Web socket connected');
        });
        this.webSocket.addEventListener('message', event => {
            this.onMessage(event);
        });
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
