import { ShapeType } from '../../../shared/Shape';
import { UnconnectedCanvas } from './Canvas';
import { EllipseRenderer } from './renderers/EllipseRenderer';
import { PencilRenderer } from './renderers/PencilRenderer';
import { RectangleRenderer } from './renderers/RectangleRenderer';
import { Renderer } from './renderers/Renderer';

export class CanvasRenderer {
    private renderTimeout?: any;
    private renderers: Record<ShapeType, Renderer<any>> = {
        ellipse: new EllipseRenderer(),
        pencil: new PencilRenderer(),
        rectangle: new RectangleRenderer(),
    };

    constructor(private canvas: UnconnectedCanvas) {}

    public render() {
        if (!this.renderTimeout) {
            this.renderTimeout = setTimeout(this.performRender.bind(this), 0);
        }
    }

    private performRender() {
        this.renderTimeout = undefined;
        if (!this.canvas.state.graphics) {
            return;
        }
        this.canvas.state.graphics.setScreen(this.canvas.props.screen);
        this.canvas.state.graphics.clear();

        for (const shape of Object.values(this.canvas.props.shapes)) {
            this.renderers[shape.type].draw(this.canvas.state.graphics, shape);
        }

        this.renderMousePositions();
    }

    private renderMousePositions() {
        const currentTime = Date.now();
        const mousePositions = this.canvas.props.mousePositions;
        const offset = this.canvas.props.screen.width / 100 / 2;
        for (const mouseID in mousePositions) {
            // Skip mouse of current user and old mouse positions
            if (
                this.canvas.props.mouseID == mouseID ||
                mousePositions[mouseID].lastUpdate + 2000 < currentTime
            ) {
                continue;
            }

            const mousePosition = mousePositions[mouseID].position;
            this.canvas.state.graphics?.drawEllipse(
                {
                    lowerLeftPoint: {
                        x: mousePosition.x - offset,
                        y: mousePosition.y - offset,
                    },
                    upperRightPoint: {
                        x: mousePosition.x + offset,
                        y: mousePosition.y + offset,
                    },
                },
                '#ffffff',
                '#3273dcaa'
            );
        }
    }
}
