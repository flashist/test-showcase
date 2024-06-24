import { RarityId } from "../../../game-logic/data/rarity/RarityId";
import { ISlotSymbolConfigVO } from "../../../slot-symbol-views/data/ISlotSymbolConfigVO";
import { IGameSlotSymbolInteractionConfigVO } from "../interactions/IGameSlotSymbolInteractionConfigVO";
import { GameSymbolId } from "./GameSymbolId";

export interface IGameSlotSymbolConfigVO extends ISlotSymbolConfigVO {
    id: GameSymbolId,
    tags?: string[];

    rarity: RarityId;

    titleId: string;
    descriptionId?: string;

    value: number;

    interactions?: IGameSlotSymbolInteractionConfigVO[];

    counter?: number;
    counterVisible?: boolean;

    valueCounterVisible?: boolean;
    valueChangeCounterVisible?: boolean;
}