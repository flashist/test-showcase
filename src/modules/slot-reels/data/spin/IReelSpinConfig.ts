import { IGenericObjectVO } from "@flashist/flibs";
import { IReelSpinMovementSequenceConfigVO } from "./movement/IReelSpinMovementSequenceConfigVO";
import { ReelSpinConfigType } from "./ReelSpinConfigType";

export interface IReelSpinConfig {
    sequences: {
        [movementType: string]: IReelSpinMovementSequenceConfigVO
    }
}