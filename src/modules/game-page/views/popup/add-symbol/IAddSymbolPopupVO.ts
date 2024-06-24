import {IGameSlotSymbolConfigVO} from "../../../../game-slot-reels/data/symbols/IGameSlotSymbolConfigVO";

export interface IAddSymbolPopupVO {
    symbols: IGameSlotSymbolConfigVO[];
    coins: number;
    spins: number;
    rerolls: number;
}