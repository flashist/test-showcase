import { appStorage } from "@flashist/appframework/state/AppStateModule";
import { TimeModuleAppState } from "@flashist/appframework/time/data/state/TimeModuleAppState";
import { TimeManagerEvent } from "@flashist/appframework/time/managers/TimeManagerEvent";
import { getInstance } from "@flashist/flibs";

import { ISpeedStopSpinMovementConfigVO } from "../../../data/spin/movement/speed/ISpeedStopSpinMovementConfigVO";
import { SlotReelsModuleState } from "../../../data/state/SlotReelsModuleState";
import { SlotReelTools } from "../../../tools/SlotReelTools";
import { SlotReelsViewSignal } from "../../../views/SlotReelsViewSignal";
import { BaseReelSpinSpeedMovementCommand } from "./BaseReelSpinSpeedMovementCommand";

export class ReelSpinSpeedStopConstantMovementCommand extends BaseReelSpinSpeedMovementCommand {

    protected spinMovementConfig: ISpeedStopSpinMovementConfigVO;

    // protected reelsModel: SlotReelsModel = getInstance(SlotReelsModel);
    // protected timeModel: TimeModel = getInstance(TimeModel);
    protected timeState: TimeModuleAppState = appStorage().getState<TimeModuleAppState>();
    protected reelsState = appStorage().getState<SlotReelsModuleState>();

    protected reelTools: SlotReelTools = getInstance(SlotReelTools);

    protected targetPosition: number;

    protected executeInternal(): void {
        super.executeInternal();

        // this.reelDataCopy.speed = this.spinMovementConfig.speed;
        this.reelDataChangeWrapper("speed", this.spinMovementConfig.speed);

        // Set pre-stop position enough to give time for all new symbols to come from the edge
        // const slotServerState: ISlotServerStateVO = getItemsForType<ISlotServerStateVO>(SlotServerStateType)[0];
        // const curSlotRoundServerData: ISlotServerRoundVO = getItem(SlotServerRoundType, slotServerState.roundId);
        // this.targetPosition = curSlotRoundServerData.stop.reelPositions[this.reelData.index];

        this.targetPosition = this.reelsState.slot.dynamic.stop.positions[this.reelData.index];
        if (this.spinMovementConfig.positionShift) {
            this.targetPosition += this.spinMovementConfig.positionShift;
        }

        //
        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            TimeManagerEvent.UPDATE,
            this.onTimeChange
        );
    }

    protected onTimeChange(): void {
        // If we're close enough to the target position that much, that the next speed step would reach the target position,
        // then manually "jump" to the target position
        let readyToFinishMovement: boolean = false;
        if (this.spinMovementConfig.speed < 0 && this.reelData.position <= this.targetPosition) {
            readyToFinishMovement = true;
        } else if (this.spinMovementConfig.speed > 0 && this.reelData.position >= this.targetPosition) {
            readyToFinishMovement = true;
        }

        if (readyToFinishMovement) {
            // Stop speed movement, to make speed-movement won't change the set position
            // this.reelDataCopy.speedMovementActive = false;
            // this.reelDataCopy.position = this.targetPosition;
            this.reelDataChangeWrapper("speedMovementActive", false);
            this.reelDataChangeWrapper("position", this.targetPosition);

            // Force rendering new position of the symbols
            this.globalDispatcher.dispatchEvent(SlotReelsViewSignal.UPDATE_POSITION);

            this.notifyComplete();
        }
    }
}