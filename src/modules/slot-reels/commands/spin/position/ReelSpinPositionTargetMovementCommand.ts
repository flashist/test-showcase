import gsap from "gsap";
import { appStorage } from "@flashist/appframework/state/AppStateModule";
import { IPositionTargetSpinMovementConfigVO } from "../../../data/spin/movement/position/IPositionTargetSpinMovementConfigVO";
import { SlotReelsModuleState } from "../../../data/state/SlotReelsModuleState";
import { BaseReelSpinPositionMovementCommand } from "./BaseReelSpinPositionMovementCommand";

export class ReelSpinPositionTargetMovementCommand extends BaseReelSpinPositionMovementCommand {

    protected spinMovementConfig: IPositionTargetSpinMovementConfigVO;

    public guard(): boolean {
        let result: boolean = super.guard();
        if (result) {
            result = (this.reelData.position !== this.spinMovementConfig.position)
        }

        return result;
    }

    protected executeInternal(): void {
        super.executeInternal();

        this.startMovement();
    }

    protected startMovement(): void {
        const tweenDuration: number = this.spinMovementConfig.duration / 1000;
        if (tweenDuration === 0) {
            this.reelDataChangeWrapper("position", this.spinMovementConfig.position);

            this.processPositionUpdate();
            this.notifyComplete();

        } else {
            const tweenAnimation: gsap.core.Tween = gsap.to(
                this.reelData,
                {
                    position: this.spinMovementConfig.position,

                    duration: tweenDuration,
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
}