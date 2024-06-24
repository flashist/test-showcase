import { IReelSymbolPositionVO } from "../../slot-reels/data/symbols/IReelSymbolPositionVO";

export interface IFindSymbolsOnReelsConfigVO {
    symbolIds?: string[];
    ignoreSymbolIds?: string[];

    symbolTags?: string[];
    ignoreSymbolTags?: string[];

    checkPositions?: IReelSymbolPositionVO[];
    ignorePositions?: IReelSymbolPositionVO[];

    randomValue?: number;
}