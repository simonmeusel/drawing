import express from 'express';
import { createServer } from 'http';
import { join } from 'path';
import { DeleteShapeHandler } from './commandHandlers/DeleteShapeHandler';
import { SetBoundingBoxHandler } from './commandHandlers/SetBoundingBoxHandler';
import { SetMousePositionHandler } from './commandHandlers/SetMousePositionHandler';
import { UpdateShapeHandler } from './commandHandlers/UpdateShapeHandler';
import { Database } from './Database';
import { SchemaManager } from './SchemaManager';
import { WebSocketServer } from './WebSocketServer';

export let database: Database;
export let schemaManager: SchemaManager;
export let webSocketServer: WebSocketServer;

async function start() {
    database = new Database(
        process.env.DRAWING_MONGODB_CONNECTION_URI ||
            'mongodb://localhost:27017/db'
    );
    schemaManager = new SchemaManager();
    webSocketServer = new WebSocketServer();

    schemaManager.initialize();

    console.log('Connecting to database');
    await database.connect();
    console.log('Connected to database');

    const app = express();

    if (
        !['0', 'false'].includes(process.env.DRAWING_SERVE_STATIC_FILES || '')
    ) {
        app.use(express.static(join('dist', 'frontend')));
    }

    const server = createServer(app);

    webSocketServer.initialize(server);

    webSocketServer.addRequestHandlers([
        new DeleteShapeHandler(webSocketServer, database),
        new SetBoundingBoxHandler(webSocketServer, database),
        new SetMousePositionHandler(webSocketServer),
        new UpdateShapeHandler(webSocketServer, database),
    ]);

    server.listen(parseInt(process.env.DRAWING_HTTP_PORT || '8080'));

    console.log('Webserver listening on port 8080 (http://localhost:8080)');
}

start();
