import { appStorage } from "@flashist/appframework/state/AppStateModule";
import { SlotReelsModuleState } from "../../../data/state/SlotReelsModuleState";
import { SlotReelsViewSignal } from "../../../views/SlotReelsViewSignal";
import { BaseReelSpinMovementPartCommand } from "../BaseReelSpinMovementPartCommand";

export abstract class BaseReelSpinPositionMovementCommand extends BaseReelSpinMovementPartCommand {

    protected executeInternal(): void {
        super.executeInternal();

        // this.reelData.speedMovementActive = false;
        appStorage().change<SlotReelsModuleState>()(`slot.dynamic.reels.${this.reelIndex}.speedMovementActive`, false);
    }

    protected processPositionUpdate(): void {
        this.globalDispatcher.dispatchEvent(SlotReelsViewSignal.UPDATE_POSITION);
    }
}