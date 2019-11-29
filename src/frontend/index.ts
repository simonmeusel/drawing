import { Context } from './Context';
import { BasicShapeTool } from './tools/BasicShapeTool';
import { WebSocketManager } from './WebSocketManager';
import { ShapeManager } from './ShapeManager';
import { EllipseRenderer } from './renderers/EllipseRenderer';
import { MoveTool } from './tools/MoveTool';
import { RectangleRenderer } from './renderers/RectangleRenderer';
import { LinesShapeTool } from './tools/LinesShapeTool';
import { LinesRenderer } from './renderers/LinesRenderer';

export let sm: ShapeManager | undefined;

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
        shapeManager.redraw();
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
        shapeManager.redraw();
    });

    canvas.addEventListener('contextmenu', event => {
        event.preventDefault();
    });
};
