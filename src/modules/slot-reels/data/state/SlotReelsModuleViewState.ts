import { IReelSymbolVO } from "../symbols/IReelSymbolVO";

export const SlotReelsModuleViewInitialState = {
    slotView: {
        lastProcessedReelViewPositions: [] as number[],
        extendedReelSymbolsData: [] as IReelSymbolVO[][]
    }
};

export type SlotReelsModuleViewState = typeof SlotReelsModuleViewInitialState;