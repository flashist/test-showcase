import { GameSymbolId } from "../../../game-slot-reels/data/symbols/GameSymbolId";
import { IRarityValueVO } from "../rarity/IRarityValueVO";

export interface IGameSymbolWinActionVO {
    x: number,
    y: number,
    animate: boolean;
    viewState: string;

    value: number;
    coef: number;
    randomValue: number;

    removesValue: number;
    rerollsValue: number;

    permanentValueChange: number;

    willBeDestroyed: boolean;

    symbolIdsToCreate: GameSymbolId[];

    counter: number;
    valueCounter: number;

    rarityModCoefs: IRarityValueVO[];
    randomNumber: number;

    nextSpinRequiredRarities: string[];
}