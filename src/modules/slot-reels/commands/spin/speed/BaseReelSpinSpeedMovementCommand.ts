import { BaseReelSpinMovementPartCommand } from "../BaseReelSpinMovementPartCommand";

export abstract class BaseReelSpinSpeedMovementCommand extends BaseReelSpinMovementPartCommand {

    protected executeInternal(): void {
        super.executeInternal();

        // this.reelDataCopy.speedMovementActive = true;
        this.reelDataChangeWrapper("speedMovementActive", true);
    }

}