import { appStorage, DeepReadonly } from "@flashist/appframework";
import { getInstance } from "@flashist/flibs";
import { GameLogicModuleState } from "../../game-logic/data/state/GameLogicModuleState";
import { GameSymbolInteractionTools } from "../../game-logic/tools/GameSymbolInteractionTools";
import { GameSymbolId } from "../data/symbols/GameSymbolId";
import { SlotReelsModuleState } from "../../slot-reels/data/state/SlotReelsModuleState";
import { SlotSymbolViewState } from "../../slot-symbol-views/data/SlotSymbolViewState";
import { GameSlotReelsModuleState } from "../data/state/GameSlotReelsModuleState";
import { GameSlotReelsModuleViewState } from "../data/state/GameSlotReelsModuleViewState";
import { IGameReelSymbolVO } from "../data/symbols/IGameReelSymbolVO";
import { IGameSlotSymbolCompanionVO } from "../data/symbols/IGameSlotSymbolCompanionVO";
import { IGameSlotSymbolConfigVO } from "../data/symbols/IGameSlotSymbolConfigVO";
import { SlotReelTools } from "../../slot-reels/tools/SlotReelTools";

export class GameSlotReelSymbolTools {

    protected gameLogicState: DeepReadonly<GameLogicModuleState>;
    protected gameReelsState: DeepReadonly<GameSlotReelsModuleState>;
    protected reelsState: DeepReadonly<SlotReelsModuleState>;
    protected gameReelsViewState: DeepReadonly<GameSlotReelsModuleViewState>;

    constructor() {
        this.gameLogicState = appStorage().getState<GameLogicModuleState>();
        this.gameReelsState = appStorage().getState<GameSlotReelsModuleState>();
        this.reelsState = appStorage().getState<SlotReelsModuleState>();
        this.gameReelsViewState = appStorage().getState<GameSlotReelsModuleViewState>();
    }

    public addOpenSymbolId(symbolId: GameSymbolId): void {
        if (this.gameLogicState.gameLogic.dynamicNotResettable.openSymbolIds.indexOf(symbolId) !== -1) {
            return;
        }

        appStorage().push<GameLogicModuleState>()("gameLogic.dynamicNotResettable.openSymbolIds", symbolId);
    }

    public addAvailableSymbolId(symbolId: GameSymbolId): IGameSlotSymbolCompanionVO {
        appStorage().push<GameLogicModuleState>()("gameLogic.dynamic.availableSymbolIds", symbolId);

        let availableSymbolCompanionDataList = appStorage().getState<GameLogicModuleState>().gameLogic.dynamic.availableSymbolCompanionDataList;

        const symbolCompanionData: IGameSlotSymbolCompanionVO = {
            id: symbolId,
            availableSymbolsIndex: availableSymbolCompanionDataList.length,
            timesOnReels: 0,

            permanentValueChange: 0,

            counterVisible: false,
            counterValueToCheck: 0,
            counterPrevProcessedValue: 0,
            counterValueToTrigger: 0,
            counterValueToShow: 0,

            valueCounterVisible: false,
            valueCounterValue: 0,

            valueChangeCounterVisible: false
        };

        const reelTools: SlotReelTools = getInstance(SlotReelTools);
        const interactionTools: GameSymbolInteractionTools = getInstance(GameSymbolInteractionTools);

        const symbolConfig: IGameSlotSymbolConfigVO = reelTools.getSymbolConfig(symbolId) as IGameSlotSymbolConfigVO;
        if (interactionTools.checkIfSymbolHasCounter(symbolId)) {
            symbolCompanionData.counterVisible = symbolConfig.counterVisible;
            symbolCompanionData.counterValueToTrigger = interactionTools.getReelSymbolCompanionCounterValue(symbolCompanionData);
            symbolCompanionData.counterValueToShow = symbolCompanionData.counterValueToTrigger;
        }

        if (interactionTools.checkIfSymbolHasValueCounter(symbolId)) {
            symbolCompanionData.valueCounterVisible = true;
        }

        if (interactionTools.checkIfSymbolHasValueChangeCounter(symbolId)) {
            symbolCompanionData.valueChangeCounterVisible = true;
            symbolCompanionData.permanentValueChange = 0;
        }

        appStorage().push<GameLogicModuleState>()("gameLogic.dynamic.availableSymbolCompanionDataList", symbolCompanionData);

        return symbolCompanionData;
    }

    public removeAvailableSymbol(symbolIndex: number): void {
        appStorage().splice<GameLogicModuleState>()("gameLogic.dynamic.availableSymbolIds", symbolIndex, 1);
        appStorage().splice<GameLogicModuleState>()("gameLogic.dynamic.availableSymbolCompanionDataList", symbolIndex, 1);

        const symbolsCount: number = this.gameLogicState.gameLogic.dynamic.availableSymbolIds.length;
        for (let correctSymbolIndex: number = symbolIndex; correctSymbolIndex < symbolsCount; correctSymbolIndex++) {
            appStorage().change<GameLogicModuleState>()(`gameLogic.dynamic.availableSymbolCompanionDataList.${correctSymbolIndex}.availableSymbolsIndex`, correctSymbolIndex);
        }

        const minRequiredAvailableSymbolsCount: number = this.getOnReelsSymbolsTotalCount();
        while (this.gameLogicState.gameLogic.dynamic.availableSymbolIds.length < minRequiredAvailableSymbolsCount) {
            this.addAvailableSymbolId(GameSymbolId.EMPTY);
        }
    }

    public getOnReelsSymbolsTotalCount(): number {
        return this.reelsState.slot.static.colsCount * this.reelsState.slot.static.rowsCount;
    }

    public getCompanionIndex(tapeIndex: number, tapePosition: number): number {
        return this.gameLogicState.gameLogic.dynamic.reelSetsCompanionIndices.default[tapeIndex]?.[tapePosition];
    }

    public getReelSymbolCompanionData(tapeIndex: number, tapePosition: number): DeepReadonly<IGameSlotSymbolCompanionVO> {
        const companionIndex: number = this.getCompanionIndex(tapeIndex, tapePosition);
        return this.gameLogicState.gameLogic.dynamic.availableSymbolCompanionDataList[companionIndex];
    }

    protected correctReelSymbolTapeData(reelIndex: number, extendedRowIndex: number, correctChange: number): void {
        const removingReelSymbolData: IGameReelSymbolVO = this.gameReelsViewState.slotView.extendedReelSymbolsData[reelIndex][extendedRowIndex];
        const removingTapeCompanionIndex: number = this.getCompanionIndex(removingReelSymbolData.tapeIndex, removingReelSymbolData.tapePosition);
        let tapesCount: number = this.gameLogicState.gameLogic.dynamic.reelSetsCompanionIndices.default.length;
        for (let tapeIndex: number = 0; tapeIndex < tapesCount; tapeIndex++) {
            let tapeCompanionIndices: Readonly<number[]> = this.gameLogicState.gameLogic.dynamic.reelSetsCompanionIndices.default[tapeIndex];
            let tapeComapnionsCount: number = tapeCompanionIndices.length;
            for (let tapeRowIndex: number = 0; tapeRowIndex < tapeComapnionsCount; tapeRowIndex++) {
                const availableCompanionIndex: number = tapeCompanionIndices[tapeRowIndex];
                if (availableCompanionIndex >= removingTapeCompanionIndex) {
                    appStorage().change<GameLogicModuleState>()(
                        `gameLogic.dynamic.reelSetsCompanionIndices.default.${tapeIndex}.${tapeRowIndex}`,
                        availableCompanionIndex + correctChange
                    );
                }
            }
        }
    }

    public removeReelSymbol(reelIndex: number, extendedRowIndex: number): void {
        const removingReelSymbolData: IGameReelSymbolVO = this.gameReelsViewState.slotView.extendedReelSymbolsData[reelIndex][extendedRowIndex];
        const removingCompanionData: IGameSlotSymbolCompanionVO = this.getReelSymbolCompanionData(removingReelSymbolData.tapeIndex, removingReelSymbolData.tapePosition);
        if (!removingCompanionData) {
            return;
        }

        this.removeAvailableSymbol(removingCompanionData.availableSymbolsIndex);
        this.correctReelSymbolTapeData(reelIndex, extendedRowIndex, -1);

        appStorage().change<GameSlotReelsModuleViewState>()(
            `slotView.extendedReelSymbolsData.${reelIndex}.${extendedRowIndex}`,
            {
                id: GameSymbolId.EMPTY,
                viewState: SlotSymbolViewState.NORMAL,
                willBeDestroyed: false,
                tapeIndex: -1,
                tapePosition: -1
            }
        );
    }

    public getReelDataByAvailableIndex(availableIndex: number): IGameReelSymbolVO {
        let result: IGameReelSymbolVO = null;
        for (let singleReelSymbols of this.gameReelsViewState.slotView.extendedReelSymbolsData) {
            for (let singleSymbol of singleReelSymbols) {
                const tempCompanionIndex: number = this.getCompanionIndex(singleSymbol.tapeIndex, singleSymbol.tapePosition);
                if (tempCompanionIndex === availableIndex) {
                    result = singleSymbol;
                    break;
                }
            }

            if (result) {
                break;
            }
        }

        return result;
    }

    public findAvailableSymbols(exceptSymbolIds: string[]): string[] {
        const result: string[] = [];

        for (let singleSymbolid of this.gameLogicState.gameLogic.dynamic.availableSymbolIds) {
            if (exceptSymbolIds.indexOf(singleSymbolid) === -1) {
                result.push(singleSymbolid);
            }
        }


        return result;
    }

}