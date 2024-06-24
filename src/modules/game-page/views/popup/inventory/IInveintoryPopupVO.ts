import {IGameSlotSymbolCompanionVO} from "../../../../game-slot-reels/data/symbols/IGameSlotSymbolCompanionVO";

export interface IInventoryPopupVO {
    symbols: IGameSlotSymbolCompanionVO[];
    coins: number;
    spins: number;
    removes: number;
}