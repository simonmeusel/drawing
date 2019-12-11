import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux';
import { Context } from './Context';
import { EllipseRenderer } from './renderers/EllipseRenderer';
import { LinesRenderer } from './renderers/LinesRenderer';
import { RectangleRenderer } from './renderers/RectangleRenderer';
import { ShapeManager } from './ShapeManager';
import { BasicShapeTool } from './tools/BasicShapeTool';
import { LinesShapeTool } from './tools/LinesShapeTool';
import { MoveTool } from './tools/MoveTool';
import { Tool } from './tools/Tool';
import { WebSocketManager } from './WebSocketManager';

interface CanvasState {
    context?: Context;
    currentToolIndex?: number;
    resizeHandler?: () => void;
    shapeManager?: ShapeManager;
    tools?: Tool[];
    webSocketManager?: WebSocketManager;
}

export class UnconnectedCanvas extends React.Component<
    ReturnType<typeof mapStateToProps>,
    CanvasState
> {
    private canvasRef = React.createRef<HTMLCanvasElement>();

    componentDidMount() {
        const canvas = this.canvasRef.current!;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const canvasContext = canvas.getContext('2d')!;

        const context = new Context(canvasContext);

        const webSocketManager = new WebSocketManager(
            'ws://' + location.host + '/' + this.props.roomID,
            context
        );

        const shapeManager = new ShapeManager(webSocketManager, context, {
            rectangle: new RectangleRenderer(),
            ellipse: new EllipseRenderer(),
            lines: new LinesRenderer(),
        });

        const resizeHandler = this.resizeCanvas.bind(this);

        this.setState({
            context,
            currentToolIndex: 0,
            resizeHandler,
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

        window.addEventListener('resize', resizeHandler);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.state.resizeHandler!);
    }

    resizeCanvas() {
        const canvas = this.canvasRef.current!;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        this.state.context!.zoom(1);
        this.state.shapeManager!.redraw();
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
            this.props.activeToolIndices[this.state.currentToolIndex!]
        ][type](
            this.state.context!.getPoint(event.clientX, event.clientY),
            this.props.toolProperties
        );
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

function mapStateToProps(state: RootState) {
    return {
        toolProperties: state.toolProperties,
        activeToolIndices: {
            0: state.selectedTool,
            1: 0,
            2: 0,
        },
        roomID: state.roomID,
    };
}

export const Canvas = connect(mapStateToProps)(UnconnectedCanvas);
