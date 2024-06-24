import { ISpinMovementConfigVO } from "../ISpinMovementConfigVO";
import { SpeedSpinMovementType } from "./SpeedSpinMovementType";

export interface ISpeedConstantSpinMovementConfigVO extends ISpinMovementConfigVO {
    subType: SpeedSpinMovementType.CONSTANT;
    speed: number;
    duration: number;
}