import * as React from 'react';
import { WebSocketManager } from './WebSocketManager';
import { Context } from './Context';
import { ShapeManager } from './ShapeManager';
import { BasicShapeTool } from './tools/BasicShapeTool';
import { EllipseRenderer } from './renderers/EllipseRenderer';
import { MoveTool } from './tools/MoveTool';
import { RectangleRenderer } from './renderers/RectangleRenderer';
import { LinesShapeTool } from './tools/LinesShapeTool';
import { LinesRenderer } from './renderers/LinesRenderer';

type CanvasState = {
    context: Context;
    shapeManager: ShapeManager;
    webSocketManger: WebSocketManager;
};

export class Canvas extends React.Component<{}, CanvasState> {
    private canvasRef = React.createRef();

    componentWillMount() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        const canvas = document.querySelector('canvas')!;
        canvas.width = width;
        canvas.height = height;

        const canvasContext = canvas.getContext('2d')!;

        const context = new Context(canvasContext);

        const webSocketManager = new WebSocketManager(
            'ws://' + location.host,
            context
        );

        const shapeManager = new ShapeManager(webSocketManager, context, {
            rectangle: new RectangleRenderer(),
            ellipse: new EllipseRenderer(),
            lines: new LinesRenderer(),
        });

        sm = shapeManager;

        const tools = [
            new MoveTool(shapeManager, context),
            new BasicShapeTool(shapeManager, context, 'rectangle'),
            new BasicShapeTool(shapeManager, context, 'ellipse'),
            new LinesShapeTool(shapeManager, context),
        ];
        const activeToolIndices = {
            0: 3,
            1: 0,
            2: 0,
        };

        this.setState({
            context,
            shapeManager,
        });
    }

    render() {
        return <canvas ref={this.canvasRef}></canvas>;
    }
}
