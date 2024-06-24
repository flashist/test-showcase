import { appStorage } from "@flashist/appframework/state/AppStateModule";
import { getInstance } from "@flashist/flibs";
import { WaitSymbolViewsToCompleteAnimation } from "../../../../slot-symbol-views/commands/WaitSymbolViewsToCompleteAnimation";
import { SlotTimeoutTools } from "../../../../slot-tools/SlotTimeoutTools";
import { SlotReelsModuleState } from "../../../data/state/SlotReelsModuleState";
import { IReelSymbolPositionVO } from "../../../data/symbols/IReelSymbolPositionVO";
import { SlotReelSymbolView } from "../../../views/symbols/SlotReelSymbolView";
import { BaseReelSpinMovementPartCommand } from "../BaseReelSpinMovementPartCommand";

export class ReelWaitAllSymbolsToCompleteAnimationsCommand extends BaseReelSpinMovementPartCommand {
    // protected reelsViewModel: SlotReelsViewModel = getInstance(SlotReelsViewModel);
    // protected reelSymbolsViewModel: SlotReelSymbolsViewModel = getInstance(SlotReelSymbolsViewModel);
    protected reelsState = appStorage().getState<SlotReelsModuleState>();

    protected executeInternal(): void {
        super.executeInternal();

        const symbolPositionsToWait: IReelSymbolPositionVO[] = [];
        // for (let singleColumnSymbolsData of ) {
        let singleColumnSymbolViews: SlotReelSymbolView[] = this.reelsState.slot.dynamic.symbolViews[this.reelData.index];
        for (let singleSymbolView of singleColumnSymbolViews) {
            if (singleSymbolView.isAnimating) {
                symbolPositionsToWait.push(
                    {
                        x: singleSymbolView.data.position.x,
                        y: singleSymbolView.data.position.y
                    }
                );
            }
        }
        // }

        getInstance(WaitSymbolViewsToCompleteAnimation, symbolPositionsToWait)
            .execute()
            .finally(
                () => {
                    // 1 frame timeout is needed to be sure that other places,
                    // which wait for the animations to be completed are processed correctly
                    SlotTimeoutTools.setTimeout(
                        () => {
                            this.notifyComplete();
                        },
                        0
                    );
                }
            );
    }
}