import * as React from 'react';
import { connect } from 'react-redux';
import { ShapeType } from '../../../shared/Shape';
import { WebSocketManager } from '../../api/WebSocketManager';
import { DispatchProps, RootState } from '../../store';
import { moveScreen } from '../../store/actions/screen/moveScreen';
import { zoomScreen } from '../../store/actions/screen/zoomScreen';
import { Graphics } from './Graphics';
import { EllipseRenderer } from './renderers/EllipseRenderer';
import { PencilRenderer } from './renderers/PencilRenderer';
import { RectangleRenderer } from './renderers/RectangleRenderer';
import { Renderer } from './renderers/Renderer';
import { BasicShapeTool } from './tools/BasicShapeTool';
import { MoveTool } from './tools/MoveTool';
import { PencilShapeTool } from './tools/PencilShapeTool';
import { Tool } from './tools/Tool';

interface CanvasProps {
    onDrawingChange?: (drawing: boolean) => void;
    webSocketManager: WebSocketManager;
}

interface CanvasState {
    currentToolIndex?: number;
    graphics?: Graphics;
    keyDownHandler?: () => void;
    renderTimeout?: any;
    resizeHandler?: () => void;
    tools?: Tool[];
}

export class UnconnectedCanvas extends React.Component<
    ReturnType<typeof mapStateToProps> & CanvasProps & DispatchProps,
    CanvasState
> {
    state: CanvasState = {};
    private canvasRef = React.createRef<HTMLCanvasElement>();
    private renderers: Record<ShapeType, Renderer<any>> = {
        ellipse: new EllipseRenderer(),
        pencil: new PencilRenderer(),
        rectangle: new RectangleRenderer(),
    };

    componentDidMount() {
        const canvas = this.canvasRef.current!;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const canvasContext = canvas.getContext('2d')!;

        const graphics = new Graphics(
            canvasContext,
            this.props.screen,
            this.props.webSocketManager
        );

        const keyDownHandler = this.onKeyDown.bind(this);
        window.addEventListener('keydown', keyDownHandler);
        const resizeHandler = this.resizeCanvas.bind(this);
        window.addEventListener('resize', resizeHandler);

        this.setState({
            currentToolIndex: 0,
            graphics,
            keyDownHandler,
            resizeHandler,
            tools: [
                new MoveTool(this.props.dispatch, graphics),
                new BasicShapeTool(this.props.dispatch, graphics, 'rectangle'),
                new BasicShapeTool(this.props.dispatch, graphics, 'ellipse'),
                new PencilShapeTool(this.props.dispatch, graphics),
            ],
        });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.state.resizeHandler!);
    }

    resizeCanvas() {
        const canvas = this.canvasRef.current!;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        this.renderDocument();
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
            this.state.graphics!.getPoint(event.clientX, event.clientY),
            this.props.toolProperties
        );
    }

    onMouseWheel(event: React.WheelEvent) {
        const zoomFactor = Math.pow(1.01, event.deltaY);
        const anchorPoint = this.state.graphics!.getPoint(
            event.clientX,
            event.clientY
        );
        this.props.dispatch(zoomScreen(anchorPoint, zoomFactor));
    }

    onKeyDown(event: KeyboardEvent) {
        if (
            event.target != document.body &&
            event.target != this.canvasRef.current
        ) {
            return;
        }

        const factor = 1 / 25;
        let x = 0;
        let y = 0;
        switch (event.keyCode) {
            case 37:
                // Left arrow pressed
                x = -1;
                break;
            case 38:
                // Up arrow pressed
                y = 1;
                break;
            case 39:
                // Right arrow pressed
                x = 1;
                break;
            case 40:
                // Down arrow pressed
                y = -1;
                break;
        }
        this.props.dispatch(moveScreen(x * factor, y * factor));
    }

    renderDocument() {
        this.state.renderTimeout = undefined;
        if (!this.state.graphics) {
            return;
        }
        this.state.graphics.setScreen(this.props.screen);
        this.state.graphics.clear();
        for (const shape of Object.values(this.props.shapes)) {
            this.renderers[shape.type].draw(this.state.graphics, shape);
        }
    }

    render() {
        if (!this.state.renderTimeout) {
            this.state.renderTimeout = setTimeout(
                this.renderDocument.bind(this),
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
        screen: state.screen,
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
