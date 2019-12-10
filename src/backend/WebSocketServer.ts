import { Server } from 'http';
import { Binary } from 'mongodb';
import * as WebSocket from 'ws';
import { database } from '.';
import { BoundingBox, doBoundingBoxesOverlap } from '../shared/BoundingBox';
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
        this.server.on('connection', (webSocket: ExtendedWebSocket) => {
            this.handleConnection(webSocket);
        });
    }

    private parseRoomID(webSocket: ExtendedWebSocket) {
        if (!webSocket.url) {
            this.disconnectWebSocket(webSocket);
            return;
        }
        const hash = new URL(webSocket.url).hash;
        if (!hash || hash.length != 36 || !uuidRegexp.test(hash)) {
            this.disconnectWebSocket(webSocket);
            return;
        }
        webSocket.roomID = BackendUUID.convertStringToBinary(hash);
    }

    private handleConnection(webSocket: ExtendedWebSocket) {
        try {
            this.parseRoomID(webSocket);

            webSocket.on('message', async data => {
                this.handleMessage(webSocket, data);
            });
        } catch (error) {
            console.warn(error);
            webSocket.close(1003);
        }
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

            // TODO: Validate request data
            const request: Request = JSON.parse(data.toString());

            if (request.command == 'setBoundingBox') {
                webSocket.boundingBox = request.boundingBox;
                webSocket.send(
                    database.serializeShape(
                        await database.findRawShapes(
                            webSocket.roomID,
                            webSocket.boundingBox
                        )
                    )
                );
            } else if (request.command == 'updateShape') {
                const rawShape = database.parseShape(
                    request.shape,
                    webSocket.roomID
                );

                database.updateShape(rawShape);

                for (const clientWebSocket of this.server!.clients as Set<
                    ExtendedWebSocket
                >) {
                    if (
                        webSocket != clientWebSocket &&
                        clientWebSocket.roomID &&
                        webSocket.roomID.buffer.equals(
                            clientWebSocket.roomID.buffer
                        ) &&
                        clientWebSocket.readyState === WebSocket.OPEN &&
                        clientWebSocket.boundingBox != undefined
                    ) {
                        if (
                            doBoundingBoxesOverlap(
                                rawShape.boundingBox,
                                clientWebSocket.boundingBox!
                            ) ||
                            (request.oldBoundingBox &&
                                doBoundingBoxesOverlap(
                                    request.oldBoundingBox,
                                    clientWebSocket.boundingBox!
                                ))
                        ) {
                            clientWebSocket.send(
                                database.serializeShape([rawShape])
                            );
                        }
                    }
                }
            }
        } catch (error) {
            console.warn(error);
            webSocket.close(1003);
        }
    }

    private disconnectWebSocket(webSocket: ExtendedWebSocket) {
        console.log('dc');

        webSocket.close(1003);
    }
}
