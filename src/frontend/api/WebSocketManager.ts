import { BoundingBox, isBoundingBoxContainer } from '../../shared/BoundingBox';
import { Message } from '../../shared/Message';
import { Point } from '../../shared/Point';
import { Request } from '../../shared/Request';
import { Shape } from '../../shared/Shape';
import { RootDispatch } from '../store';
import { setMousePosition } from '../store/actions/setMousePosition';
import { deleteShape } from '../store/actions/shapes/deleteShape';
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
        private debounceDelay,
        private baseURI: string = WEB_SOCKET_BASE_URI
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
        this.webSocket.addEventListener('message', (event) => {
            this.onMessage(event);
        });

        for (const shapeID in this.debouncedShapes) {
            this.discardShape(shapeID);
        }
    }

    public onMessage(event: MessageEvent) {
        const data: Message = JSON.parse(event.data);
        switch (data.command) {
            case 'updateShapes':
                for (const shape of data.shapes) {
                    this.dispatch!(updateShape(shape, false, false));
                }
                break;
            case 'deleteShape':
                this.dispatch!(deleteShape(data.shapeID, false, false));
                break;
            case 'setMousePosition':
                this.dispatch!(
                    setMousePosition(data.mouseID, data.mousePosition, false)
                );
                break;
            default:
                break;
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
            shapeID,
        });
    }

    private discardShape(shapeID: string) {
        if (this.debouncedShapes.hasOwnProperty(shapeID)) {
            clearTimeout(this.debouncedShapes[shapeID].timeout);
            delete this.debouncedShapes[shapeID];
        }
    }

    public setMousePosition(mouseID: string, mousePosition: Point) {
        this.sendRequest({
            command: 'setMousePosition',
            mouseID,
            mousePosition,
        });
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
