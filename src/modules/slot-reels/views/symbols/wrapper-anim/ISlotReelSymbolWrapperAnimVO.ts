import { ISlotSymbolConfigVO } from "../../../../slot-symbol-views/data/ISlotSymbolConfigVO";
import { ISlotSymbolStateConfigVO } from "../../../../slot-symbol-views/data/ISlotSymbolStateConfigVO";
import { IReelSymbolVO } from "../../../data/symbols/IReelSymbolVO";

export interface ISlotReelSymbolWrapperAnimVO {
    symbolConfig: ISlotSymbolConfigVO,
    stateId: string,
    symbolStateConfig: ISlotSymbolStateConfigVO,
    reelSymbol: IReelSymbolVO
}