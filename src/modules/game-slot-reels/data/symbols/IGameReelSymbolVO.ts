import { IReelSymbolVO } from "../../../slot-reels/data/symbols/IReelSymbolVO";

export interface IGameReelSymbolVO extends IReelSymbolVO {
    willBeDestroyed: boolean;
    valueCounter: number;
}