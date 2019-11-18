import { Context } from './Context';
import { EllipseTool } from './tools/EllipseTool';
import { WebSocketManager } from './WebSocketManager';
import { StrokeManager } from './StrokeManager';
import { EllipseRenderer } from './renderers/EllipseRenderer';

window.onload = () => {
    console.log('Starting');

    const width = window.innerWidth;
    const height = window.innerHeight;

    const canvas = document.querySelector('canvas')!;
    canvas.width = width;
    canvas.height = height;

    const canvasContext = canvas.getContext('2d')!;

    const context = new Context(canvasContext);

    const webSocketManager = new WebSocketManager('ws://' + location.host);

    const strokeManager = new StrokeManager(webSocketManager, context, {
        ellipse: new EllipseRenderer(),
    });

    const tools = [new EllipseTool(strokeManager)];
    const activeToolIndex = 0;

    canvas.addEventListener('mousedown', event => {
        tools[activeToolIndex].onMouseDown(
            context.getPoint(event.clientX, event.clientY)
        );
    });
    canvas.addEventListener('mousemove', event => {
        tools[activeToolIndex].onMouseMove(
            context.getPoint(event.clientX, event.clientY)
        );
    });
    canvas.addEventListener('mouseup', event => {
        tools[activeToolIndex].onMouseUp(
            context.getPoint(event.clientX, event.clientY)
        );
    });

    canvas.addEventListener('wheel', event => {
        context.zoom(event.deltaY, event.clientX, event.clientY);
        strokeManager.redraw();
    });
};
