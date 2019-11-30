import { Context } from '../Context';
import { Shape } from '../../../../shared/Shape';

export abstract class Renderer<T extends Shape> {
    public abstract draw(context: Context, shape: T);
}
