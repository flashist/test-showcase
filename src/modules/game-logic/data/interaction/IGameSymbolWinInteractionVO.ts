import { IGameSymbolWinActionVO } from "./IGameSymbolWinActionVO";

export interface IGameSymbolWinInteractionVO {

    winActions: IGameSymbolWinActionVO[];

    // symbolPositionsToDestroy: { x: number, y: number }[];
}