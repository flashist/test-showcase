import { appStorage } from "@flashist/appframework/state/AppStateModule";
import { DeepReadonly } from "@flashist/appframework/state/data/DeepReadableTypings";
import { ObjectTools } from "@flashist/fcore";
import gsap from "gsap";
import { ISingleReelVO } from "../../../data/ISingleReelVO";

import { IPositionStopSpinMovementConfigVO } from "../../../data/spin/movement/position/IPositionStopSpinMovementConfigVO";
import { SlotReelsModuleState } from "../../../data/state/SlotReelsModuleState";
import { BaseReelSpinPositionMovementCommand } from "./BaseReelSpinPositionMovementCommand";

export class ReelSpinPositionStopMovementCommand extends BaseReelSpinPositionMovementCommand {

    protected spinMovementConfig: IPositionStopSpinMovementConfigVO;

    protected targetPosition: number;

    protected executeInternal(): void {
        super.executeInternal();

        // Set pre-stop position enough to give time for all new symbols to come from the edge
        // const slotServerState: ISlotServerStateVO = getItemsForType<ISlotServerStateVO>(SlotServerStateType)[0];
        // const curSlotRoundServerData: ISlotServerRoundVO = getItem(SlotServerRoundType, slotServerState.roundId);

        this.targetPosition = this.reelsState.slot.dynamic.stop.positions[this.reelIndex];
        if (this.spinMovementConfig.positionShift) {
            this.targetPosition += this.spinMovementConfig.positionShift;
        }

        this.startMovement();
    }

    protected startMovement(): void {
        const tweenAnimation: gsap.core.Tween = gsap.to(
            this.reelData,
            {
                position: this.targetPosition,

                duration: this.spinMovementConfig.duration / 1000,
                ease: this.spinMovementConfig.ease,
                onUpdate: () => {
                    this.reelDataChangeWrapper("position", this.reelData.position);
                    this.processPositionUpdate();
                },
                onComplete: () => {
                    this.notifyComplete();
                }
            }
        );
        this.tweenAnimations.push(tweenAnimation);
    }
}