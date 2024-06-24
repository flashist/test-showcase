import { ISpinMovementConfigVO } from "../ISpinMovementConfigVO";
import { StopMovementDirection } from "../position/StopMovementDirection";
import { PrepareSpinMovementType } from "./PrepareSpinMovementType";

export interface IPrepareToStopSpinMovementConfigVO extends ISpinMovementConfigVO {
    subType: PrepareSpinMovementType;
    direction: StopMovementDirection;
}