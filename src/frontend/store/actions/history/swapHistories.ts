export const SWAP_HISTORIES = 'SWAP_HISTORIES';

export interface SwapHistoriesAction {
    type: typeof SWAP_HISTORIES;
}

export function swapHistories(): SwapHistoriesAction {
    return {
        type: SWAP_HISTORIES,
    };
}
