import { UpdateShapeRequest } from '../../shared/Request';
import { Database } from '../Database';
import { RoomIDWebSocket, WebSocketServer } from '../WebSocketServer';
import { RequestHandler } from './RequestHandler';

export class UpdateShapeHandler extends RequestHandler {
    public constructor(
        private webSocketServer: WebSocketServer,
        private database: Database
    ) {
        super('updateShape');
    }

    public async onRequest(
        request: UpdateShapeRequest,
        webSocket: RoomIDWebSocket
    ) {
        const rawShape = this.database.parseShape(
            request.shape,
            webSocket.roomID
        );

        this.database.updateShape(rawShape);
        /* TODO fetch old bounding box from database
            (request.oldBoundingBox &&
                doBoundingBoxesOverlap(
                    request.oldBoundingBox,
                    clientWebSocket.boundingBox!
                ))*/
        this.webSocketServer.forEachWebSocket(
            webSocket.roomID,
            rawShape.boundingBox,
            async (clientWebSocket) => {
                if (webSocket == clientWebSocket) {
                    return;
                }
                this.webSocketServer.sendMessage(clientWebSocket, {
                    command: 'updateShapes',
                    shapes: this.database.serializeShapes([rawShape]),
                });
            }
        );
    }
}
