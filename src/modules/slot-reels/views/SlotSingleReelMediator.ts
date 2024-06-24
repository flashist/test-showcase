import { BaseAppMediator } from "@flashist/appframework/base/mediators/BaseAppMediator";
import { appStorage } from "@flashist/appframework/state/AppStateModule";
import { DeepReadonly } from "@flashist/appframework/state/data/DeepReadableTypings";
import { SlotReelsModuleState } from "../data/state/SlotReelsModuleState";
import { SlotReelsModuleViewState } from "../data/state/SlotReelsModuleViewState";

import { SlotReelsViewSignal } from "./SlotReelsViewSignal";
import { SlotSingleReelView } from "./SlotSingleReelView";

export class SlotSingleReelMediator extends BaseAppMediator<SlotSingleReelView> {

    // protected reelsViewModel: SlotReelsViewModel = getInstance(SlotReelsViewModel);
    // protected reelsModel: SlotReelsModel = getInstance(SlotReelsModel);

    protected reelsState: DeepReadonly<SlotReelsModuleState>;
    protected reelsViewState: DeepReadonly<SlotReelsModuleViewState>;

    onActivatorStart(activator: SlotSingleReelView): void {
        super.onActivatorStart(activator);

        this.reelsState = appStorage().getState<SlotReelsModuleState>();
        this.reelsViewState = appStorage().getState<SlotReelsModuleViewState>();

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            SlotReelsViewSignal.RENDER_SYMBOLS,
            this.onRenderSymbols
        );

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            SlotReelsViewSignal.UPDATE_POSITION,
            this.onUpdatePosition
        );

        this.renderCurrentSymbols();
        this.renderCurrentPosition();
    }

    // protected onGameStarted(): void {
    //     this.renderCurrentSymbols();
    //     this.renderCurrentPosition();
    // }

    protected onRenderSymbols(): void {
        this.renderCurrentSymbols();
    }

    protected onUpdatePosition(): void {
        this.renderCurrentPosition();
    }

    protected renderCurrentPosition(): void {
        this.activator.reelPosition = this.reelsState.slot.dynamic.reels[this.activator.reelIndex].position;
    }

    protected renderCurrentSymbols(): void {
        this.activator.extendedSymbolsData = this.reelsViewState.slotView.extendedReelSymbolsData[this.activator.reelIndex];
        this.activator.forceSymbolsRender();
    }
}