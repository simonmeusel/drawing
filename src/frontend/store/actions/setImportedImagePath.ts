export const SET_IMPORTED_IMAGE_PATH = 'SET_IMPORTED_IMAGE_PATH';

export interface SetImportedImagePathAction {
    type: typeof SET_IMPORTED_IMAGE_PATH;
    imagePath: string;
    lastUpdate: number;
    sendToBackend: boolean;
}

export function setImportedImagePath(
    imagePath: string,
    sendToBackend = true
): SetImportedImagePathAction {
    return {
        type: SET_IMPORTED_IMAGE_PATH,
        imagePath: imagePath,
        lastUpdate: Date.now(),
        sendToBackend,
    };
}
