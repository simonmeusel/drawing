import { Context } from './Context';
import { BasicStrokeTool } from './tools/BasicStrokeTool';
import { WebSocketManager } from './WebSocketManager';
import { StrokeManager } from './StrokeManager';
import { EllipseRenderer } from './renderers/EllipseRenderer';
import { MoveTool } from './tools/MoveTool';
import { RectangleRenderer } from './renderers/RectangleRenderer';
import { LinesTool } from './tools/LinesTool';
import { LinesRenderer } from './renderers/LinesRenderer';

window.onload = () => {
    console.log('Starting');

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

    const strokeManager = new StrokeManager(webSocketManager, context, {
        rectangle: new RectangleRenderer(),
        ellipse: new EllipseRenderer(),
        lines: new LinesRenderer(),
    });

    const tools = [
        new MoveTool(strokeManager, context),
        new BasicStrokeTool(strokeManager, context, 'rectangle'),
        new BasicStrokeTool(strokeManager, context, 'ellipse'),
        new LinesTool(strokeManager, context),
    ];
    const activeToolIndices = {
        0: 3,
        1: 0,
        2: 0,
    };

    let currentToolIndice = 0;

    canvas.addEventListener('mousedown', event => {
        event.preventDefault();
        tools[activeToolIndices[event.button]].onMouseDown(
            context.getPoint(event.clientX, event.clientY)
        );
        currentToolIndice = event.button;
    });

    canvas.addEventListener('mousemove', event => {
        event.preventDefault();
        tools[activeToolIndices[currentToolIndice]].onMouseMove(
            context.getPoint(event.clientX, event.clientY)
        );
    });

    canvas.addEventListener('mouseup', event => {
        event.preventDefault();
        tools[activeToolIndices[currentToolIndice]].onMouseUp(
            context.getPoint(event.clientX, event.clientY)
        );
    });

    canvas.addEventListener('wheel', event => {
        context.zoom(event.deltaY, event.clientX, event.clientY);
        strokeManager.redraw();
    });

    document.addEventListener('keydown', event => {
        const translation = context.getWidth() / 25;
        switch (event.keyCode) {
            case 37:
                // Left arrow pressed
                context.translateX(-translation);
                break;
            case 38:
                // Up arrow pressed
                context.translateY(translation);
                break;
            case 39:
                // Right arrow pressed
                context.translateX(translation);
                break;
            case 40:
                // Down arrow pressed
                context.translateY(-translation);
                break;
        }
        strokeManager.redraw();
    });
};
