import { DeleteShapeRequest } from '../../shared/Request';
import { BackendUUID } from '../BackendUUID';
import { Database } from '../Database';
import { RoomIDWebSocket, WebSocketServer } from '../WebSocketServer';
import { RequestHandler } from './RequestHandler';

export class DeleteShapeHandler extends RequestHandler {
    public constructor(
        private webSocketServer: WebSocketServer,
        private database: Database
    ) {
        super('deleteShape');
    }

    public async onRequest(
        request: DeleteShapeRequest,
        webSocket: RoomIDWebSocket
    ) {
        const oldRawShape = await this.database.findRawShape(
            webSocket.roomID,
            BackendUUID.convertStringToBinary(request.shapeID)
        );
        if (!oldRawShape) {
            return;
        }

        this.database.deleteShape(
            webSocket.roomID,
            BackendUUID.convertStringToBinary(request.shapeID)
        );

        this.webSocketServer.forEachWebSocket(
            webSocket.roomID,
            oldRawShape.boundingBox,
            async (clientWebSocket) => {
                if (webSocket == clientWebSocket) {
                    return;
                }
                this.webSocketServer.sendMessage(clientWebSocket, {
                    command: 'deleteShape',
                    shapeID: request.shapeID,
                });
            }
        );
    }
}
