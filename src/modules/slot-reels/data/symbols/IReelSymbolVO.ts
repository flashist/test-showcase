import { IReelSymbolPositionVO } from "./IReelSymbolPositionVO";

export interface IReelSymbolVO {
    position: IReelSymbolPositionVO;
    id: string;
    viewState: string;

    preservingPrevState: boolean;

    tapeIndex: number;
    tapePosition: number;
}