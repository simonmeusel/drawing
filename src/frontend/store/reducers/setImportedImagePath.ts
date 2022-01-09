import { RootState } from '..';
import { SetImportedImagePathAction } from '../actions/setImportedImagePath';

export function reduceSetImportedImagePath(
    state: RootState,
    action: SetImportedImagePathAction,
): RootState {
    return {
        ...state,
        importedImagePath: action.imagePath,
    };
}
