import { Shape } from '../../../../shared/Shape';
import { Graphics } from '../Graphics';

export abstract class Renderer<T extends Shape> {
    public abstract draw(graphics: Graphics, shape: T);
}
