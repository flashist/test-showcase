import { IChangeReelStateMovementConfigVO } from "../../../data/spin/movement/state/IChangeReelStateMovementConfigVO";
import { BaseReelSpinMovementPartCommand } from "../BaseReelSpinMovementPartCommand";

export class ReelStateChangeMovementCommand extends BaseReelSpinMovementPartCommand {
    protected spinMovementConfig: IChangeReelStateMovementConfigVO;

    protected executeInternal(): void {
        super.executeInternal();

        // this.reelDataCopy.state = this.spinMovementConfig.state;
        this.reelDataChangeWrapper("state", this.spinMovementConfig.state);

        this.notifyComplete();
    }
}