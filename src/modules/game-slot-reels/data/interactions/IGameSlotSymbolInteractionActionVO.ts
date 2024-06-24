import { IRarityValueVO } from "../../../game-logic/data/rarity/IRarityValueVO";
import { GameSymbolId } from "../symbols/GameSymbolId";
import { GameSlotSymbolInteractionActionType } from "./GameSlotSymbolInteractionActionType";

export interface IGameSlotSymbolInteractionActionVO {
    type?: GameSlotSymbolInteractionActionType;

    viewState?: string;
    ignoreAnim?: boolean;

    value?: number;
    coef?: number;
    permanentValueChange?: number;

    minRandomValue?: number;
    maxRandomValue?: number;

    minRandomNumber?: number;
    maxRandomNumber?: number;

    targetValueCoef?: number;

    destroying?: boolean;
    symbolIdsToCreate?: GameSymbolId[];

    randomSymbolIds?: GameSymbolId[]
    randomSymbolIdsCount?: number;
    randomSymbolsUseRarity?: boolean;

    counter?: number;

    valueCounter?: number;
    useValueCounter?: boolean;

    rariyModCoefs?: IRarityValueVO[];

    removesValue?: number;
    rerollsValue?: number;

    nextSpinRequiredRarities?: string[];
}