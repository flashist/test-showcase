import { BaseAppCommand } from "@flashist/appframework/base/commands/BaseAppCommand";
import { appStorage } from "@flashist/appframework/state/AppStateModule";
import { getInstance, Point } from "@flashist/flibs";
import { SlotGameStateManager } from "../../game-logic/managers/SlotGameStateManager";
import { SlotSymbolViewState } from "../../slot-symbol-views/data/SlotSymbolViewState";
import { ISingleReelVO } from "../data/ISingleReelVO";
import { ReelState } from "../data/ReelState";
import { SlotReelsModuleState } from "../data/state/SlotReelsModuleState";
import { SlotReelsModuleViewState } from "../data/state/SlotReelsModuleViewState";
import { IReelSymbolVO } from "../data/symbols/IReelSymbolVO";
import { SlotReelsEvent } from "../events/SlotReelsEvent";
import { SlotReelTools } from "../tools/SlotReelTools";
import { SlotReelsViewSignal } from "../views/SlotReelsViewSignal";
import { SlotReelSymbolView } from "../views/symbols/SlotReelSymbolView";

export class InitReelsCommand extends BaseAppCommand {
    protected executeInternal(): void {
        const reelTools: SlotReelTools = getInstance(SlotReelTools);

        const reelsState = appStorage().getState<SlotReelsModuleState>();

        const extendedRowsCount: number = reelsState.slot.static.rowsCount + (reelsState.slot.static.additionalVisibleSymbolsCount * 2);
        for (let reelIndex: number = 0; reelIndex < reelsState.slot.static.colsCount; reelIndex++) {
            // TODO: init data in the reels model
            // - create reel states
            // - set initial positions of reels
            const singleReelData: ISingleReelVO = {
                index: reelIndex,
                position: 0,
                speed: 0,
                speedMovementActive: false,
                state: ReelState.STOPPED
            };
            appStorage().change<SlotReelsModuleState>()(`slot.dynamic.reels.${reelIndex}`, singleReelData);

            //
            appStorage().change<SlotReelsModuleViewState>()(`slotView.extendedReelSymbolsData.${reelIndex}`, []);
            appStorage().change<SlotReelsModuleViewState>()(`slotView.lastProcessedReelViewPositions.${reelIndex}`, reelsState.slot.dynamic.stop.positions[reelIndex]);

            for (let rowIndex: number = 0; rowIndex < extendedRowsCount; rowIndex++) {
                const symbolData: IReelSymbolVO = {
                    id: "",
                    position: {
                        x: reelIndex,
                        y: rowIndex,
                    },
                    viewState: SlotSymbolViewState.NORMAL,

                    preservingPrevState: false,

                    tapeIndex: -1,
                    tapePosition: -1
                };
                appStorage().change<SlotReelsModuleViewState>()(`slotView.extendedReelSymbolsData.${reelIndex}.${rowIndex}`, symbolData);

                const changeWrapper = appStorage().changePropertyWrapper<SlotReelsModuleState>()(`slot.dynamic.symbolViews`);
                if (!reelsState.slot.dynamic.symbolViews[reelIndex]) {
                    changeWrapper(`${reelIndex}`, []);
                }
                if (!reelsState.slot.dynamic.symbolViews[reelIndex][rowIndex]) {
                    const tempSymbolView: SlotReelSymbolView = getInstance(SlotReelSymbolView, new Point(reelsState.slot.static.symbols.size.x, reelsState.slot.static.symbols.size.y));
                    reelsState.slot.dynamic.symbolViews[reelIndex][rowIndex] = tempSymbolView;
                }
            }

            reelTools.setSingleReelSymbolsBasedOnPosition(reelIndex, singleReelData.position);
        }

        const gameStateManager: SlotGameStateManager = getInstance(SlotGameStateManager);
        gameStateManager.enterWaitUserInputState();

        this.globalDispatcher.dispatchEvent(SlotReelsViewSignal.RENDER_SYMBOLS);
        this.globalDispatcher.dispatchEvent(SlotReelsEvent.INIT_COMPLETE);

        this.notifyComplete();
    }

}