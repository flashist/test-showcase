import { BaseAppManager } from "@flashist/appframework/base/managers/BaseAppManager";
import { appStorage } from "@flashist/appframework/state/AppStateModule";
import { SlotReelsModuleState } from "../../slot-reels/data/state/SlotReelsModuleState";
import { SlotReelsModuleViewState } from "../../slot-reels/data/state/SlotReelsModuleViewState";
import { IReelSymbolVO } from "../../slot-reels/data/symbols/IReelSymbolVO";
import { SlotReelsEvent } from "../../slot-reels/events/SlotReelsEvent";
import { SlotReelsViewSignal } from "../../slot-reels/views/SlotReelsViewSignal";
import { SlotReelSymbolView } from "../../slot-reels/views/symbols/SlotReelSymbolView";
import { SlotReelSymbolViewEvent } from "../../slot-reels/views/symbols/SlotReelSymbolViewEvent";

export class SlotSymbolViewStatesManager extends BaseAppManager {

    protected addListeners(): void {
        super.addListeners();

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            SlotReelsEvent.INIT_COMPLETE,
            this.onSlotReelsInitComplete
        );
    }

    protected onSlotReelsInitComplete(): void {
        // const reelSymbolsViewModel: SlotReelSymbolsViewModel = getInstance(SlotReelSymbolsViewModel);
        const reelsState = appStorage().getState<SlotReelsModuleState>();

        let colsCount: number = reelsState.slot.dynamic.symbolViews.length;
        for (let colIndex: number = 0; colIndex < colsCount; colIndex++) {
            let colSymbols: SlotReelSymbolView[] = reelsState.slot.dynamic.symbolViews[colIndex];
            let rowsCount: number = colSymbols.length;
            for (let rowIndex: number = 0; rowIndex < rowsCount; rowIndex++) {
                const singleSymbolView: SlotReelSymbolView = colSymbols[rowIndex];

                this.eventListenerHelper.addEventListener(
                    singleSymbolView,
                    SlotReelSymbolViewEvent.STATE_ANIMATION_COMPLETE,
                    this.onSingleSymbolStateAnimComplete
                );
            }
        }
    }

    protected onSingleSymbolStateAnimComplete(view: SlotReelSymbolView): void {
        if (view.reelSymbolStateConfig.nextStateId) {
            // const reelsViewModel: SlotReelsViewModel = getInstance(SlotReelsViewModel);
            const reelsViewState = appStorage().getState<SlotReelsModuleViewState>();
            const reelSymbolData: IReelSymbolVO = reelsViewState.slotView.extendedReelSymbolsData[view.data.position.x][view.data.position.y];
            reelSymbolData.viewState = view.reelSymbolStateConfig.nextStateId;

            this.globalDispatcher.dispatchEvent(SlotReelsViewSignal.RENDER_SYMBOLS);
        }
    }

}