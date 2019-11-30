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
import { Tool } from './tools/Tool';

type CanvasState = {
    activeToolIndices?: { [button: number]: number };
    context?: Context;
    currentToolIndex?: number;
    shapeManager?: ShapeManager;
    tools?: Tool[];
    webSocketManager?: WebSocketManager;
};

export class Canvas extends React.Component<{}, CanvasState> {
    private canvasRef = React.createRef<HTMLCanvasElement>();

    componentDidMount() {
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

        this.setState({
            activeToolIndices: {
                0: 3,
                1: 0,
                2: 0,
            },
            context,
            currentToolIndex: 0,
            shapeManager,
            tools: [
                new MoveTool(shapeManager, context),
                new BasicShapeTool(shapeManager, context, 'rectangle'),
                new BasicShapeTool(shapeManager, context, 'ellipse'),
                new LinesShapeTool(shapeManager, context),
            ],
            webSocketManager,
        });

        context.screenChangeHandler = () => {
            this.state.webSocketManager!.setBoundingBox(this.context.screen);
        };

        window.addEventListener('resize', this.resizeCanvas);
    }

    componentWillUnmount() {
        window.addEventListener('resize', this.resizeCanvas);
    }

    resizeCanvas() {
        console.warn('Resize not implemented yet');
    }

    onMouseDown(event: React.MouseEvent) {
        this.setState({
            currentToolIndex: event.button,
        });
        this.onToolEvent('onMouseDown', event);
    }

    onMouseMove(event: React.MouseEvent) {
        this.onToolEvent('onMouseMove', event);
    }

    onMouseUp(event: React.MouseEvent) {
        this.onToolEvent('onMouseUp', event);
    }

    onToolEvent(
        type: 'onMouseDown' | 'onMouseMove' | 'onMouseUp',
        event: React.MouseEvent
    ) {
        event.preventDefault();
        this.state.tools![
            this.state.activeToolIndices![this.state.currentToolIndex!]
        ][type](this.state.context!.getPoint(event.clientX, event.clientY));
    }

    onMouseWheel(event: React.WheelEvent) {
        this.state.context!.zoom(event.deltaY, event.clientX, event.clientY);
        this.state.shapeManager!.redraw();
    }

    onKeyDown(event: React.KeyboardEvent) {
        const translation = this.state.context!.getWidth() / 25;
        switch (event.keyCode) {
            case 37:
                // Left arrow pressed
                this.state.context!.translateX(-translation);
                break;
            case 38:
                // Up arrow pressed
                this.state.context!.translateY(translation);
                break;
            case 39:
                // Right arrow pressed
                this.state.context!.translateX(translation);
                break;
            case 40:
                // Down arrow pressed
                this.state.context!.translateY(-translation);
                break;
        }
        this.state.shapeManager!.redraw();
    }

    render() {
        return (
            <canvas
                ref={this.canvasRef}
                onMouseDown={this.onMouseDown.bind(this)}
                onMouseMove={this.onMouseMove.bind(this)}
                onMouseUp={this.onMouseUp.bind(this)}
                onWheel={this.onMouseWheel.bind(this)}
                onContextMenu={event => event.preventDefault()}
            ></canvas>
        );
    }
}
