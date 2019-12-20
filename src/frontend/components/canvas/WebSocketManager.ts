import { BoundingBox } from '../../../shared/BoundingBox';
import { Request } from '../../../shared/Request';
import { Shape } from '../../../shared/Shape';
import { addRoomIDToBrowserHistory } from '../../store/roomID';
import { Graphics } from './Graphics';

export class WebSocketManager {
    private webSocket?: WebSocket;
    public onShapes?: (shapes: Shape[]) => void;
    private roomID?: string;
    private pendingRequests: Request[] = [];

    private debouncedShapes: {
        [shapeID: string]: {
            shape: Shape;
            oldBoundingBox?: BoundingBox;
            timeout: any;
        };
    } = {};

    constructor(
        private baseURI: string,
        private graphics: Graphics,
        private debounceDelay = 100
    ) {
        if (!baseURI.endsWith('/')) {
            throw new Error('Base URI must end with a /');
        }
    }

    public setRoomID(roomID: string) {
        if (this.roomID == roomID) {
            return;
        }
        this.roomID = roomID;
        addRoomIDToBrowserHistory(roomID);
        this.webSocket = new WebSocket(this.baseURI + roomID);
        this.webSocket.addEventListener('open', () => {
            console.log('Web socket connected');
            this.onScreenChange();
        });
        this.webSocket.addEventListener('message', event => {
            this.onMessage(event);
        });
        this.graphics.screenChangeHandler = () => {
            this.onScreenChange();
        };
        for (const shapeID in this.debouncedShapes) {
            this.discardShape(shapeID);
        }
    }

    public onScreenChange() {
        this.setBoundingBox(this.graphics.sbb);
    }

    public onMessage(event: MessageEvent) {
        if (this.onShapes) {
            const shapes: Shape[] = JSON.parse(event.data);
            this.onShapes(shapes);
        }
    }

    public updateShape(shape: Shape, oldBoundingBox?: BoundingBox) {
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

    public deleteShape(shapeID: string) {
        this.discardShape(shapeID);
        this.sendRequest({
            command: 'deleteShape',
            shapeID: shapeID,
        });
    }

    private discardShape(shapeID: string) {
        if (this.debouncedShapes.hasOwnProperty(shapeID)) {
            clearTimeout(this.debouncedShapes[shapeID].timeout);
            delete this.debouncedShapes[shapeID];
        }
    }

    public setBoundingBox(boundingBox: BoundingBox) {
        this.sendRequest({
            command: 'setBoundingBox',
            boundingBox: boundingBox,
        });
    }

    private sendRequest(request: Request) {
        if (!this.webSocket) {
            return;
        }

        if (this.webSocket.readyState == WebSocket.CONNECTING) {
            this.pendingRequests.push(request);
        } else {
            this.webSocket.send(JSON.stringify(request));
        }
    }
}
