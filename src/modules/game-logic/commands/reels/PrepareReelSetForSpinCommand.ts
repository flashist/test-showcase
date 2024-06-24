import { DeepReadonly } from "@flashist/appframework";
import { BaseAppCommand } from "@flashist/appframework/base/commands/BaseAppCommand";
import { appStorage } from "@flashist/appframework/state/AppStateModule";
import { ArrayTools, NumberTools } from "@flashist/fcore";
import { GameSlotReelsModuleState } from "../../../game-slot-reels/data/state/GameSlotReelsModuleState";
import { IGameSlotSymbolCompanionVO } from "../../../game-slot-reels/data/symbols/IGameSlotSymbolCompanionVO";
import { DefaultSlotReelSetId } from "../../../slot-reels/data/reels/DefaultSlotReelSetId";
import { SlotReelsModuleState } from "../../../slot-reels/data/state/SlotReelsModuleState";
import { GameLogicModuleState } from "../../data/state/GameLogicModuleState";

export class PrepareReelSetForSpinCommand extends BaseAppCommand {

    protected reelsState = appStorage().getState<SlotReelsModuleState>();
    protected gameLogicState = appStorage().getState<GameLogicModuleState>();

    protected executeInternal(): void {
        // this.globalDispatcher.dispatchEvent(SlotReelsViewSignal.RENDER_SYMBOLS);

        const availableSymbolIdsCopy: string[] = this.gameLogicState.gameLogic.dynamic.availableSymbolIds.concat();

        const reelTapeCompanionsForSpin: DeepReadonly<IGameSlotSymbolCompanionVO>[][] = [];
        const reelTapeCompanionIndicesForSpin: number[][] = [];

        const reelTapesForSpin: string[][] = [];
        const minSymbolsPerReel: number = Math.floor(availableSymbolIdsCopy.length / this.reelsState.slot.static.colsCount);
        for (let reelIndex: number = 0; reelIndex < this.reelsState.slot.static.colsCount; reelIndex++) {
            const singleReelSymbolIds: string[] = [];
            reelTapesForSpin[reelIndex] = singleReelSymbolIds;

            reelTapeCompanionsForSpin[reelIndex] = [];
            reelTapeCompanionIndicesForSpin[reelIndex] = [];

            for (let rowIndex: number = 0; rowIndex < minSymbolsPerReel; rowIndex++) {
                const tempCompanionData: DeepReadonly<IGameSlotSymbolCompanionVO> = this.getRandomAvailableCompanionData(availableSymbolIdsCopy);

                availableSymbolIdsCopy[tempCompanionData.availableSymbolsIndex] = null;
                singleReelSymbolIds.push(tempCompanionData.id);

                reelTapeCompanionsForSpin[reelIndex][rowIndex] = tempCompanionData;
                reelTapeCompanionIndicesForSpin[reelIndex][rowIndex] = tempCompanionData.availableSymbolsIndex;
            }
        }


        while (availableSymbolIdsCopy.find((item?: string) => { return !!item })) {
            const tempCompanionData: IGameSlotSymbolCompanionVO = this.getRandomAvailableCompanionData(availableSymbolIdsCopy);
            availableSymbolIdsCopy[tempCompanionData.availableSymbolsIndex] = null;

            const randReelIndex: number = NumberTools.getRandomInt(0, this.reelsState.slot.static.colsCount - 1);
            reelTapesForSpin[randReelIndex].push(tempCompanionData.id);
            reelTapeCompanionsForSpin[randReelIndex].push(tempCompanionData);
            reelTapeCompanionIndicesForSpin[randReelIndex].push(tempCompanionData.availableSymbolsIndex);
        }

        // Clear reel set first, to make sure there are no leftovers from the previous reel sets,
        // for the cases when the amount of symbols is reduced
        appStorage().change<SlotReelsModuleState>()(`slot.dynamic.reelSets.${DefaultSlotReelSetId}.reels`, []);
        // Set the new reel set
        appStorage().change<SlotReelsModuleState>()(`slot.dynamic.reelSets.${DefaultSlotReelSetId}.reels`, reelTapesForSpin);

        // // Clear reel set first
        appStorage().change<GameLogicModuleState>()(`gameLogic.dynamic.reelSetsCompanionIndices.${DefaultSlotReelSetId}`, []);
        // // Set the new reel set
        // appStorage().change<GameSlotReelsModuleState>()(`slot.dynamic.reelSetsCompanionIndices.${DefaultSlotReelSetId}`, reelTapeCompanionsForSpin);
        appStorage().change<GameLogicModuleState>()(`gameLogic.dynamic.reelSetsCompanionIndices.${DefaultSlotReelSetId}`, reelTapeCompanionIndicesForSpin);

        this.notifyComplete();
    }


    protected getRandomAvailableCompanionData(availableSymbolIdsCopy: string[]): DeepReadonly<IGameSlotSymbolCompanionVO> {
        const randSymbolId: string = ArrayTools.getRandomItem(availableSymbolIdsCopy, [null])
        // const randSymbolSourceIndex: number = this.gameLogicState.gameLogic.dynamic.availableSymbolIds.indexOf(randSymbolId);
        const randSymbolSourceIndex: number = availableSymbolIdsCopy.indexOf(randSymbolId);
        // availableSymbolIdsCopy[randSymbolSourceIndex] = null;

        return this.gameLogicState.gameLogic.dynamic.availableSymbolCompanionDataList[randSymbolSourceIndex];
    }
}