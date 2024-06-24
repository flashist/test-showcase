import { ISpinMovementConfigVO } from "../ISpinMovementConfigVO";
import { SpeedSpinMovementType } from "./SpeedSpinMovementType";

export interface ISpeedAccelerationSpinMovementConfigVO extends ISpinMovementConfigVO {
    subType: SpeedSpinMovementType.ACCELERATION;
    speed: number;
    duration: number;
    ease?: string;
}