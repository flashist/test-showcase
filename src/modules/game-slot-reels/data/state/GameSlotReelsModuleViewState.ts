import { SlotReelsModuleViewState } from "../../../slot-reels/data/state/SlotReelsModuleViewState";
import { IGameReelSymbolVO } from "../symbols/IGameReelSymbolVO";

export const GameSlotReelsModuleViewInitialState = {
    slotView: {
        extendedReelSymbolsData: [] as IGameReelSymbolVO[][]
    }
};

export type GameSlotReelsModuleViewState = typeof GameSlotReelsModuleViewInitialState & SlotReelsModuleViewState;