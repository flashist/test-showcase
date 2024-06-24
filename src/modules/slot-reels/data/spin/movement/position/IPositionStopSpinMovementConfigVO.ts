import { ISpinMovementConfigVO } from "../ISpinMovementConfigVO";
import { PositionSpinMovementType } from "./PositionSpinMovementType";

export interface IPositionStopSpinMovementConfigVO extends ISpinMovementConfigVO {
    subType: PositionSpinMovementType.STOP;
    positionShift: number;
    ease?: string;
    duration?: number;
}