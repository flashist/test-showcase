import {IGameSlotSymbolCompanionVO} from "../../../../game-slot-reels/data/symbols/IGameSlotSymbolCompanionVO";
import {IGameSlotSymbolConfigVO} from "../../../../game-slot-reels/data/symbols/IGameSlotSymbolConfigVO";

export interface ICompanionSymbolInfoPopupVO {
    companion: IGameSlotSymbolCompanionVO,
    config: IGameSlotSymbolConfigVO,
    removeVisible: boolean
}