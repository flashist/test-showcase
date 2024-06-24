import { SpinMovementPartType } from "./SpinMovementPartType";

export interface ISpinMovementConfigVO {
    type: SpinMovementPartType;
    subType: string;
    symbolsViewState?: string;
}