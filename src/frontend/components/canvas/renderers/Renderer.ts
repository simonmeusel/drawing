import { Shape } from '../../../../shared/Shape';
import { Context } from '../Context';

export abstract class Renderer<T extends Shape> {
    public abstract draw(context: Context, shape: T);
}
