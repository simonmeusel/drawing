import { BoundingBox } from '../../../shared/BoundingBox';
import { Request } from '../../../shared/Request';
import { Shape } from '../../../shared/Shape';
import { Context } from './Context';

export class WebSocketManager {
    private webSocket: WebSocket;
    onShapes?: (shapes: Shape[]) => void;

    private debouncedShapes: {
        [shapeID: string]: {
            shape: Shape;
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
        if (this.onShapes) {
            const shapes: Shape[] = JSON.parse(event.data);
            this.onShapes(shapes);
        }
    }

    updateShape(shape: Shape, oldBoundingBox?: BoundingBox) {
        if (this.debouncedShapes[shape.id]) {
            this.debouncedShapes[shape.id].shape = shape;
        } else {
            this.debouncedShapes[shape.id] = {
                shape: shape,
                oldBoundingBox,
                timeout: setTimeout(() => {
                    this.sendRequest({
                        command: 'updateShape',
                        oldBoundingBox: this.debouncedShapes[shape.id]
                            .oldBoundingBox,
                        shape: this.debouncedShapes[shape.id].shape,
                    });
                    delete this.debouncedShapes[shape.id];
                }, this.debounceDelay),
            };
        }
    }

    deleteShape(shapeID: string) {
        if (this.debouncedShapes[shapeID]) {
            clearTimeout(this.debouncedShapes[shapeID].timeout);
            delete this.debouncedShapes[shapeID];
        }
        this.sendRequest({
            command: 'deleteShape',
            shapeID: shapeID,
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
