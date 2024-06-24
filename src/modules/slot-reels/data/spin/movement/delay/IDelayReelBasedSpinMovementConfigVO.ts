import { ISpinMovementConfigVO } from "../ISpinMovementConfigVO";
import { DelaySpinMovementType } from "./DelaySpinMovementType";

export interface IDelayReelBasedSpinMovementConfigVO extends ISpinMovementConfigVO {
    subType: DelaySpinMovementType;
    duration: number;
}