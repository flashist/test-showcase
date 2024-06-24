import { ReelState } from "../../../ReelState";
import { ISpinMovementConfigVO } from "../ISpinMovementConfigVO";
import { StateSpinMovementType } from "./StateSpinMovementType";

export interface IChangeReelStateMovementConfigVO extends ISpinMovementConfigVO {
    subType: StateSpinMovementType.CHANGE;
    state: ReelState;
}