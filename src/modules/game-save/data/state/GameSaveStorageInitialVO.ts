export const GameSaveStorageInitialVO = {
    gameLogic: {
        dynamicNotResettable: {
            openSymbolIds: [] as string[]
        }
    }
};

export type GameSaveStorageVO = typeof GameSaveStorageInitialVO;