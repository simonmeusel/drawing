import { SetMousePositionRequest } from '../../shared/Request';
import { RoomIDWebSocket, WebSocketServer } from '../WebSocketServer';
import { RequestHandler } from './RequestHandler';

export class SetMousePositionHandler extends RequestHandler {
    public constructor(private webSocketServer: WebSocketServer) {
        super('setMousePosition');
    }

    public async onRequest(
        request: SetMousePositionRequest,
        webSocket: RoomIDWebSocket
    ) {
        this.webSocketServer.forEachWebSocket(
            webSocket.roomID,
            webSocket.boundingBox,
            async (clientWebSocket) => {
                if (webSocket == clientWebSocket) {
                    return;
                }
                this.webSocketServer.sendMessage(clientWebSocket, {
                    command: 'setMousePosition',
                    mouseID: request.mouseID,
                    mousePosition: request.mousePosition,
                });
            }
        );
    }
}
