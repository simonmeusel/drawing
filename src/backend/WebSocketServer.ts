import { IncomingMessage, Server } from 'http';
import { Binary } from 'mongodb';
import * as WebSocket from 'ws';
import { schemaManager } from '.';
import { BoundingBox, doBoundingBoxesOverlap } from '../shared/BoundingBox';
import { Message } from '../shared/Message';
import { Request } from '../shared/Request';
import { BackendUUID } from './BackendUUID';
import { RequestHandler } from './commandHandlers/RequestHandler';

export const uuidRegexp = /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;

export type ExtendedWebSocket = WebSocket & {
    boundingBox?: BoundingBox;
    roomID?: Binary;
};

export type RoomIDWebSocket = ExtendedWebSocket & {
    roomID: Binary;
};

export class WebSocketServer {
    private server?: WebSocket.Server;
    private handlers: { [command: string]: RequestHandler } = {};

    public initialize(httpServer: Server) {
        this.server = new WebSocket.Server({ server: httpServer });
        this.server.on(
            'connection',
            (webSocket: ExtendedWebSocket, request: IncomingMessage) => {
                this.handleConnection(webSocket, request);
            }
        );
    }

    private parseRoomID(
        webSocket: ExtendedWebSocket,
        request: IncomingMessage
    ) {
        const url = request.url;
        if (!url || url.length != 37 || !url.startsWith('/')) {
            this.disconnectWebSocket(webSocket);
            return;
        }
        const roomID = url.substring(1);
        if (!uuidRegexp.test(roomID)) {
            this.disconnectWebSocket(webSocket);
            return;
        }
        webSocket.roomID = BackendUUID.convertStringToBinary(roomID);
    }

    private handleConnection(
        webSocket: ExtendedWebSocket,
        request: IncomingMessage
    ) {
        try {
            this.parseRoomID(webSocket, request);

            webSocket.on('message', async (data) => {
                this.handleMessage(webSocket, data);
            });
        } catch (error) {
            console.warn(error);
            webSocket.close(1003);
        }
    }

    /**
     * Executes a function for each websocket in a room seeing a part of a given bounding box
     */
    public async forEachWebSocket(
        roomID: Binary,
        boundingBox: BoundingBox | undefined,
        f: (clientWebSocket: ExtendedWebSocket) => Promise<void> | void
    ) {
        for (const clientWebSocket of this.server!
            .clients as Set<ExtendedWebSocket>) {
            if (
                clientWebSocket.roomID &&
                roomID.buffer.equals(clientWebSocket.roomID.buffer) &&
                clientWebSocket.readyState === WebSocket.OPEN &&
                clientWebSocket.boundingBox != undefined
            ) {
                if (
                    !boundingBox ||
                    doBoundingBoxesOverlap(
                        boundingBox,
                        clientWebSocket.boundingBox!
                    )
                ) {
                    await f(clientWebSocket);
                }
            }
        }
    }

    public sendMessage(webSocket: ExtendedWebSocket, message: Message) {
        webSocket.send(JSON.stringify(message));
    }

    private async handleMessage(
        webSocket: ExtendedWebSocket,
        data: WebSocket.Data
    ) {
        try {
            if (!webSocket.roomID) {
                this.disconnectWebSocket(webSocket);
                return;
            }

            data = data.toString();
            if (typeof data != 'string' || data.length > 16384) {
                this.disconnectWebSocket(webSocket);
                return;
            }
            const request: Request = JSON.parse(data.toString());
            schemaManager.validateData('Request', request);

            const handler = this.handlers[request.command];
            if (handler) {
                await handler.onRequest(request, webSocket as RoomIDWebSocket);
            } else {
                // TODO: Handle invalid command
            }
        } catch (error) {
            console.warn(error);
            webSocket.close(1003);
        }
    }

    private disconnectWebSocket(webSocket: ExtendedWebSocket) {
        console.log('Disconnected websocket');

        webSocket.close(1003);
    }

    public addRequestHandlers(handlers: RequestHandler[]) {
        for (const handler of handlers) {
            this.handlers[handler.getCommand()] = handler;
        }
    }
}
