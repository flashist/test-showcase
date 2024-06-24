import {BaseAppCommand} from "@flashist/appframework/base/commands/BaseAppCommand";
import {appStorage} from "@flashist/appframework/state/AppStateModule";
import {GameLogicModuleInitialState, GameLogicModuleState} from "../../data/state/GameLogicModuleState";
import {SlotReelsModuleInitialState, SlotReelsModuleState} from "../../../slot-reels/data/state/SlotReelsModuleState";
import {
    SlotReelsModuleViewInitialState,
    SlotReelsModuleViewState
} from "../../../slot-reels/data/state/SlotReelsModuleViewState";
import {SlotReelSymbolView} from "../../../slot-reels/views/symbols/SlotReelSymbolView";

export class ResetFloorDataCommand extends BaseAppCommand {

    protected executeInternal(): void {
        appStorage().delete<GameLogicModuleState>()("gameLogic.dynamic");
        appStorage().change<GameLogicModuleState>()("gameLogic.dynamic", GameLogicModuleInitialState.gameLogic.dynamic);


        // Remove symbol views
        const reelsState = appStorage().getState<SlotReelsModuleState>();
        const prevSymbolViews: SlotReelSymbolView[][] = reelsState.slot.dynamic.symbolViews.concat();
        // // Remove from the previous parent, to reuse in a new one
        // for (let reelViews of reelsState.slot.dynamic.symbolViews) {
        //     for (let singleSymbolView of reelViews) {
        //         DisplayTools.childRemoveItselfFromParent(singleSymbolView);
        //     }
        // }
        //
        appStorage().delete<SlotReelsModuleState>()("slot.dynamic");
        appStorage().change<SlotReelsModuleState>()("slot.dynamic", SlotReelsModuleInitialState.slot.dynamic);
        // Re-use previous symbol views in the new game too (cuz they are added to reel views)
        const changeWrapper = appStorage().changePropertyWrapper<SlotReelsModuleState>()(`slot.dynamic.symbolViews`);

        let reelsCount: number = prevSymbolViews.length;
        for (let reelIndex: number = 0; reelIndex < reelsCount; reelIndex++) {
            let colsCount: number = prevSymbolViews[reelIndex].length;
            for (let rowIndex: number = 0; rowIndex < colsCount; rowIndex++) {
                let tempSymbolView: SlotReelSymbolView = prevSymbolViews[reelIndex][rowIndex];

                if (!reelsState.slot.dynamic.symbolViews[reelIndex]) {
                    changeWrapper(`${reelIndex}`, []);
                }
                reelsState.slot.dynamic.symbolViews[reelIndex][rowIndex] = tempSymbolView;
            }
        }

        appStorage().delete<SlotReelsModuleViewState>()("slotView");
        appStorage().change<SlotReelsModuleViewState>()("slotView", SlotReelsModuleViewInitialState.slotView);

        this.notifyComplete();
    }

}