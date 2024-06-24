import { ISpinMovementConfigVO } from "./ISpinMovementConfigVO";

export interface IReelSpinMovementSequenceConfigVO {
    type: string;
    parts: ISpinMovementConfigVO[];
}