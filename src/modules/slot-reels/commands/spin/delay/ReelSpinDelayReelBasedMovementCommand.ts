
import { SlotTimeoutTools } from "../../../../slot-tools/SlotTimeoutTools";
import { ISingleReelVO } from "../../../data/ISingleReelVO";
import { IDelayReelBasedSpinMovementConfigVO } from "../../../data/spin/movement/delay/IDelayReelBasedSpinMovementConfigVO";
import { BaseReelSpinMovementPartCommand } from "../BaseReelSpinMovementPartCommand";

export abstract class ReelSpinDelayReelBasedMovementCommand extends BaseReelSpinMovementPartCommand {

    constructor(protected spinMovementConfig: IDelayReelBasedSpinMovementConfigVO, protected reelIndex: number) {
        super(spinMovementConfig, reelIndex);
    }

    protected executeInternal(): void {
        super.executeInternal();

        const completeTimeout = SlotTimeoutTools.setTimeout(
            () => {
                this.notifyComplete();
            },
            this.spinMovementConfig.duration * this.reelIndex
        );
        this.timeouts.push(completeTimeout);
    }
}