import { IncomingMessage, Server } from 'http';
import { Binary } from 'mongodb';
import * as WebSocket from 'ws';
import { database, schemaManager } from '.';
import { BoundingBox, doBoundingBoxesOverlap } from '../shared/BoundingBox';
import { Message } from '../shared/Message';
import { Request } from '../shared/Request';
import { BackendUUID } from './BackendUUID';

export const uuidRegexp = /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;

type ExtendedWebSocket = WebSocket & {
    boundingBox?: BoundingBox;
    roomID?: Binary;
};

export class WebSocketServer {
    private server?: WebSocket.Server;

    initialize(httpServer: Server) {
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
    private async forEachWebSocket(
        roomID: Binary,
        boundingBox: BoundingBox | undefined,
        f: (clientWebSocket: ExtendedWebSocket) => Promise<void> | void
    ) {
        for (const clientWebSocket of this.server!.clients as Set<
            ExtendedWebSocket
        >) {
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

    private sendMessage(webSocket: ExtendedWebSocket, message: Message) {
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

            if (request.command == 'setBoundingBox') {
                webSocket.boundingBox = request.boundingBox;
                this.sendMessage(webSocket, {
                    command: 'updateShapes',
                    shapes: database.serializeShape(
                        await database.findRawShapes(
                            webSocket.roomID,
                            webSocket.boundingBox
                        )
                    ),
                });
            } else if (request.command == 'setMousePosition') {
                this.forEachWebSocket(
                    webSocket.roomID,
                    webSocket.boundingBox,
                    async (clientWebSocket) => {
                        if (webSocket == clientWebSocket) {
                            return;
                        }
                        this.sendMessage(clientWebSocket, {
                            command: 'setMousePosition',
                            mouseID: request.mouseID,
                            mousePosition: request.mousePosition,
                        });
                    }
                );
            } else if (request.command == 'updateShape') {
                const rawShape = database.parseShape(
                    request.shape,
                    webSocket.roomID
                );

                database.updateShape(rawShape);
                /* TODO fetch old bounding box from database
                    (request.oldBoundingBox &&
                        doBoundingBoxesOverlap(
                            request.oldBoundingBox,
                            clientWebSocket.boundingBox!
                        ))*/
                this.forEachWebSocket(
                    webSocket.roomID,
                    rawShape.boundingBox,
                    async (clientWebSocket) => {
                        if (webSocket == clientWebSocket) {
                            return;
                        }
                        this.sendMessage(clientWebSocket, {
                            command: 'updateShapes',
                            shapes: database.serializeShape([rawShape]),
                        });
                    }
                );
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
}
