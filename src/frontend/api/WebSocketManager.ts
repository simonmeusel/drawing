import { BoundingBox, isBoundingBoxContainer } from '../../shared/BoundingBox';
import { Request } from '../../shared/Request';
import { Shape } from '../../shared/Shape';
import { RootDispatch } from '../store';
import { updateShape } from '../store/actions/shapes/updateShape';
import { addRoomIDToBrowserHistory } from '../store/roomID';

const WEB_SOCKET_BASE_URI =
    process.env.REACT_APP_WEB_SOCKET_BASE_URI ||
    (location.protocol == 'http:' ? 'ws' : 'wss') + '://' + location.host + '/';

export class WebSocketManager {
    private webSocket?: WebSocket;
    private roomID?: string;
    private pendingRequests: Request[] = [];
    public dispatch?: RootDispatch;
    private screenBoundingBox: BoundingBox = {
        lowerLeftPoint: { x: 0, y: 0 },
        upperRightPoint: { x: 0, y: 0 },
    };

    private debouncedShapes: {
        [shapeID: string]: {
            shape: Shape;
            timeout: any;
        };
    } = {};

    constructor(
        private baseURI: string = WEB_SOCKET_BASE_URI,
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
            console.log(`Web socket for room ${roomID} connected`);
            this.setScreenBoundingBox(this.screenBoundingBox);

            for (const request of this.pendingRequests) {
                this.sendRequest(request);
            }
        });
        this.webSocket.addEventListener('message', event => {
            this.onMessage(event);
        });

        for (const shapeID in this.debouncedShapes) {
            this.discardShape(shapeID);
        }
    }

    public onMessage(event: MessageEvent) {
        const shapes: Shape[] = JSON.parse(event.data);
        for (const shape of shapes) {
            this.dispatch!(updateShape(shape, false));
        }
    }

    public updateShape(shape: Shape) {
        if (this.debouncedShapes[shape.id]) {
            this.debouncedShapes[shape.id].shape = shape;
        } else {
            this.debouncedShapes[shape.id] = {
                shape: shape,
                timeout: setTimeout(() => {
                    this.sendRequest({
                        command: 'updateShape',
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

    public setScreenBoundingBox(boundingBox: BoundingBox) {
        if (isBoundingBoxContainer(this.screenBoundingBox, boundingBox)) {
            return;
        }
        this.screenBoundingBox = boundingBox;
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
