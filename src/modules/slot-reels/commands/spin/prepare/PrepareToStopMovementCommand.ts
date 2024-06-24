import { appStorage } from "@flashist/appframework/state/AppStateModule";
import { getInstance } from "@flashist/flibs";

import { IPrepareToStopSpinMovementConfigVO } from "../../../data/spin/movement/prepare/IPrepareToStopSpinMovementConfigVO";
import { SlotReelsModuleViewState } from "../../../data/state/SlotReelsModuleViewState";
import { SlotReelTools } from "../../../tools/SlotReelTools";
import { BaseReelSpinMovementPartCommand } from "../BaseReelSpinMovementPartCommand";

export class PrepareToStopMovementCommand extends BaseReelSpinMovementPartCommand {
    protected spinMovementConfig: IPrepareToStopSpinMovementConfigVO;
    protected reelTools: SlotReelTools = getInstance(SlotReelTools);

    protected executeInternal(): void {
        super.executeInternal();

        const curPositionDelta: number = (this.reelData.position % 1);
        const roundPreStopPosition: number = this.reelTools.getPreStopTapePosition(this.reelData.index, this.spinMovementConfig.direction);
        // this.reelDataCopy.position = roundPreStopPosition + curPositionDelta;
        // this.applyReelDataChanges();
        this.reelDataChangeWrapper("position", roundPreStopPosition + curPositionDelta);

        // this.reelsViewState.lastProcessedReelViewPositions[this.reelData.index] = roundPreStopPosition + Math.round(curPositionDelta);
        const newViewPos: number = roundPreStopPosition + Math.round(curPositionDelta);
        appStorage().change<SlotReelsModuleViewState>()(`slotView.lastProcessedReelViewPositions.${this.reelData.index}`, newViewPos);

        this.notifyComplete();
    }
}