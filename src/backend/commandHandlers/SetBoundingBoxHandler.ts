import { SetBoundingBoxRequest } from '../../shared/Request';
import { Database } from '../Database';
import { RoomIDWebSocket, WebSocketServer } from '../WebSocketServer';
import { RequestHandler } from './RequestHandler';

export class SetBoundingBoxHandler extends RequestHandler {
    public constructor(
        private webSocketServer: WebSocketServer,
        private database: Database
    ) {
        super('setBoundingBox');
    }

    public async onRequest(
        request: SetBoundingBoxRequest,
        webSocket: RoomIDWebSocket
    ) {
        webSocket.boundingBox = request.boundingBox;
        this.webSocketServer.sendMessage(webSocket, {
            command: 'updateShapes',
            shapes: this.database.serializeShapes(
                await this.database.findRawShapes(
                    webSocket.roomID,
                    webSocket.boundingBox
                )
            ),
        });
    }
}
