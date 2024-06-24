import { SlotTimeoutTools } from "../../../../slot-tools/SlotTimeoutTools";
import { ISpeedConstantSpinMovementConfigVO } from "../../../data/spin/movement/speed/ISpeedConstantSpinMovementConfigVO";
import { BaseReelSpinSpeedMovementCommand } from "./BaseReelSpinSpeedMovementCommand";

export class ReelSpinSpeedConstantMovementCommand extends BaseReelSpinSpeedMovementCommand {

    protected spinMovementConfig: ISpeedConstantSpinMovementConfigVO;

    protected executeInternal(): void {
        super.executeInternal();

        // this.reelDataCopy.speed = this.spinMovementConfig.speed;
        // this.applyReelDataChanges();
        this.reelDataChangeWrapper("speed", this.spinMovementConfig.speed);

        if (this.spinMovementConfig.duration >= 0) {
            if (this.spinMovementConfig.duration === 0) {
                this.notifyComplete();

            } else if (this.spinMovementConfig.duration > 0) {
                const durationTimeout = SlotTimeoutTools.setTimeout(
                    () => {
                        this.notifyComplete();
                    },
                    this.spinMovementConfig.duration
                );
                this.timeouts.push(durationTimeout);
            }

        } else {
            // If duration is not set, then do the constant speed changing infinitely
        }
    }
}