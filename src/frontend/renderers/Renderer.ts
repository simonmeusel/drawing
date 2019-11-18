import { Context } from '../Context';
import { Stroke } from '../../shared/Stroke';

export abstract class Renderer {
    public abstract draw(context: Context, stroke: Stroke);
}
