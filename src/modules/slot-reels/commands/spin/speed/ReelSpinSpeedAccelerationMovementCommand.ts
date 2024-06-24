import gsap from "gsap";
import { ISpeedAccelerationSpinMovementConfigVO } from "../../../data/spin/movement/speed/ISpeedAccelerationSpinMovementConfigVO";
import { BaseReelSpinSpeedMovementCommand } from "./BaseReelSpinSpeedMovementCommand";

export class ReelSpinSpeedAccelerationMovementCommand extends BaseReelSpinSpeedMovementCommand {

    protected spinMovementConfig: ISpeedAccelerationSpinMovementConfigVO;

    protected executeInternal(): void {
        super.executeInternal();

        if (this.reelData.speed === this.spinMovementConfig.speed) {
            this.notifyComplete();

        } else {
            this.startMovement();
        }
    }

    protected startMovement(): void {
        const tweenAnimation: gsap.core.Tween = gsap.to(
            this.reelData,
            {
                speed: this.spinMovementConfig.speed,

                duration: this.spinMovementConfig.duration / 1000,
                ease: this.spinMovementConfig.ease,
                onUpdate: () => {
                    this.reelDataChangeWrapper("speed", this.reelData.speed);
                },
                onComplete: () => {
                    // this.applyReelDataChanges();
                    // this.reelDataChangeWrapper("speed", this.sourceReelData.speed);

                    this.notifyComplete();
                }
            }
        );
        this.tweenAnimations.push(tweenAnimation);
    }
}



