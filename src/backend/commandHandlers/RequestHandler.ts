import { Request } from '../../shared/Request';
import { RoomIDWebSocket } from '../WebSocketServer';

export abstract class RequestHandler {
    public constructor(private command: string) {}

    public getCommand() {
        return this.command;
    }

    public abstract onRequest(request: Request, webSocket: RoomIDWebSocket);
}
