import * as React from 'react';
import { connect } from 'react-redux';
import { ShapeType } from '../../../shared/Shape';
import { DispatchProps, RootState } from '../../store';
import { Context } from './Context';
import { EllipseRenderer } from './renderers/EllipseRenderer';
import { LinesRenderer } from './renderers/LinesRenderer';
import { RectangleRenderer } from './renderers/RectangleRenderer';
import { Renderer } from './renderers/Renderer';
import { BasicShapeTool } from './tools/BasicShapeTool';
import { LinesShapeTool } from './tools/LinesShapeTool';
import { MoveTool } from './tools/MoveTool';
import { Tool } from './tools/Tool';
import { WebSocketManager } from './WebSocketManager';

const WEB_SOCKET_BASE_URI =
    process.env.REACT_APP_WEB_SOCKET_BASE_URI ||
    (location.protocol == 'http:' ? 'ws' : 'wss') + '://' + location.host + '/';

interface CanvasProps {
    onDrawingChange?: (drawing: boolean) => void;
}

interface CanvasState {
    context?: Context;
    currentToolIndex?: number;
    keyDownHandler?: () => void;
    renderTimeout?: any;
    resizeHandler?: () => void;
    tools?: Tool[];
    webSocketManager?: WebSocketManager;
}

export class UnconnectedCanvas extends React.Component<
    ReturnType<typeof mapStateToProps> & CanvasProps & DispatchProps,
    CanvasState
> {
    state: CanvasState = {};
    private canvasRef = React.createRef<HTMLCanvasElement>();
    private renderers: Record<ShapeType, Renderer<any>> = {
        ellipse: new EllipseRenderer(),
        lines: new LinesRenderer(),
        rectangle: new RectangleRenderer(),
    };

    componentDidMount() {
        const canvas = this.canvasRef.current!;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const canvasContext = canvas.getContext('2d')!;

        const context = new Context(canvasContext);

        const webSocketManager = new WebSocketManager(
            WEB_SOCKET_BASE_URI,
            context
        );
        webSocketManager.setRoomID(this.props.roomID);

        const keyDownHandler = this.onKeyDown.bind(this);
        window.addEventListener('keydown', keyDownHandler);
        const resizeHandler = this.resizeCanvas.bind(this);
        window.addEventListener('resize', resizeHandler);

        this.setState({
            context,
            currentToolIndex: 0,
            keyDownHandler,
            resizeHandler,
            tools: [
                new MoveTool(this.props.dispatch, context),
                new BasicShapeTool(this.props.dispatch, context, 'rectangle'),
                new BasicShapeTool(this.props.dispatch, context, 'ellipse'),
                new LinesShapeTool(this.props.dispatch, context),
            ],
            webSocketManager,
        });

        context.screenChangeHandler = () => {
            this.state.webSocketManager!.setBoundingBox(this.context.screen);
        };
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.state.resizeHandler!);
    }

    resizeCanvas() {
        const canvas = this.canvasRef.current!;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        this.state.context!.zoom(1);
    }

    onMouseDown(event: React.MouseEvent) {
        this.canvasRef.current?.focus();
        if (this.props.onDrawingChange) {
            this.props.onDrawingChange(true);
        }
        this.setState({
            currentToolIndex: event.button,
        });
        this.onToolEvent('onMouseDown', event, event.button);
    }

    onMouseMove(event: React.MouseEvent) {
        this.onToolEvent('onMouseMove', event);
    }

    onMouseUp(event: React.MouseEvent) {
        if (this.props.onDrawingChange) {
            this.props.onDrawingChange(false);
        }
        this.onToolEvent('onMouseUp', event);
    }

    onToolEvent(
        type: 'onMouseDown' | 'onMouseMove' | 'onMouseUp',
        event: React.MouseEvent,
        button: number = this.state.currentToolIndex!
    ) {
        event.preventDefault();
        this.state.tools![this.props.activeToolIndices[button]][type](
            this.state.context!.getPoint(event.clientX, event.clientY),
            this.props.toolProperties
        );
    }

    onMouseWheel(event: React.WheelEvent) {
        this.state.context!.zoom(event.deltaY, event.clientX, event.clientY);
    }

    onKeyDown(event: KeyboardEvent) {
        if (
            event.target != document.body &&
            event.target != this.canvasRef.current
        ) {
            return;
        }

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
    }

    renderContext() {
        this.state.renderTimeout = undefined;
        if (!this.state.context) {
            return;
        }
        this.state.context.clear();
        for (const shape of Object.values(this.props.shapes)) {
            this.renderers[shape.type].draw(this.state.context, shape);
        }
    }

    render() {
        if (this.state && this.state.webSocketManager) {
            this.state.webSocketManager!.setRoomID(this.props.roomID);
        }

        if (!this.state.renderTimeout) {
            this.state.renderTimeout = setTimeout(
                this.renderContext.bind(this),
                0
            );
        }

        return (
            <canvas
                ref={this.canvasRef}
                tabIndex={-1}
                onMouseDown={this.onMouseDown.bind(this)}
                onMouseMove={this.onMouseMove.bind(this)}
                onMouseUp={this.onMouseUp.bind(this)}
                onMouseLeave={this.onMouseUp.bind(this)}
                onWheel={this.onMouseWheel.bind(this)}
                onContextMenu={event => event.preventDefault()}
            ></canvas>
        );
    }
}

function mapStateToProps(state: RootState) {
    return {
        shapes: state.document.shapes,
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
