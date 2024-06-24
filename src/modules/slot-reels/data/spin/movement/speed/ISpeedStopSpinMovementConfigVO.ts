import { ISpinMovementConfigVO } from "../ISpinMovementConfigVO";
import { SpeedSpinMovementType } from "./SpeedSpinMovementType";

export interface ISpeedStopSpinMovementConfigVO extends ISpinMovementConfigVO {
    subType: SpeedSpinMovementType.STOP;
    speed: number;
    positionShift?: number;
}