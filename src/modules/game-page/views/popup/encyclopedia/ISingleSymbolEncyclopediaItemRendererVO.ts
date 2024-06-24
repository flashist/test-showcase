import {IGameSlotSymbolConfigVO} from "../../../../game-slot-reels/data/symbols/IGameSlotSymbolConfigVO";
import {IRarityConfigVO} from "../../../../game-logic/data/rarity/IRarityConfigVO";

export interface ISingleSymbolEncyclopediaItemRendererVO {
    symbolConfig: IGameSlotSymbolConfigVO;
    rarityConfig: IRarityConfigVO;
    isOpen: boolean;
}