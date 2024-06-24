export const GamePageModuleInitialState = {
    gamePage: {
        disableUi: false as boolean,

        popups: {
            settings: false as boolean,
            mission: false as boolean,
            missionBonus: false as boolean,
            addSymbol: {
                visible: false as boolean,
                symbolIds: [] as string[]
            },
            inventory: false as boolean,
            companionSymbolInfo: {
                visible: false as boolean,
                companionIndex: -1 as number,
            },
            configSymbolInfo: {
                visible: false as boolean,
                symbolId: "" as string
            },
            encyclopedia: false as boolean,
            gameOver: false as boolean
        }
    }
};
export type GamePageModuleState = typeof GamePageModuleInitialState;