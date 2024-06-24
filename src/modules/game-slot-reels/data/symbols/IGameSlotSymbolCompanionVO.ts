export interface IGameSlotSymbolCompanionVO {
    id: string;
    availableSymbolsIndex: number;
    timesOnReels: number;

    permanentValueChange: number;

    counterVisible: boolean;
    counterValueToCheck: number;
    counterValueToTrigger: number;
    counterPrevProcessedValue: number;
    counterValueToShow: number;

    valueCounterVisible: boolean;
    valueCounterValue: number;

    valueChangeCounterVisible: boolean;

    lastWinActionRandomValue?: number;
    lastWinActionRandomNumber?: number;
}