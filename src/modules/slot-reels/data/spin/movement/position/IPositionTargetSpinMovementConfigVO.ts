import { ISpinMovementConfigVO } from "../ISpinMovementConfigVO";
import { PositionSpinMovementType } from "./PositionSpinMovementType";

export interface IPositionTargetSpinMovementConfigVO extends ISpinMovementConfigVO {
    subType: PositionSpinMovementType;
    position?: number;
    ease?: string;
    duration?: number;
}