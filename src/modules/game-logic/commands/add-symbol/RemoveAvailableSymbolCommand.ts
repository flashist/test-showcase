import { appStorage, BaseAppCommand } from "@flashist/appframework";
import { getInstance } from "@flashist/flibs";
import { IGameReelSymbolVO } from "../../../game-slot-reels/data/symbols/IGameReelSymbolVO";
import { GameSlotReelSymbolTools } from "../../../game-slot-reels/tools/GameSlotReelSymbolTools";
import { GameLogicModuleState } from "../../data/state/GameLogicModuleState";
import {SlotReelsViewSignal} from "../../../slot-reels/views/SlotReelsViewSignal";

export class RemoveAvailableSymbolCommand extends BaseAppCommand {
    constructor(protected indexInAvailableSymbols: number) {
        super();
    }

    protected executeInternal(): void {
        const gameSymbolTools: GameSlotReelSymbolTools = getInstance(GameSlotReelSymbolTools);

        const reelSymbol: IGameReelSymbolVO = gameSymbolTools.getReelDataByAvailableIndex(this.indexInAvailableSymbols);
        if (reelSymbol) {
            gameSymbolTools.removeReelSymbol(reelSymbol.position.x, reelSymbol.position.y);

        } else {
            gameSymbolTools.removeAvailableSymbol(this.indexInAvailableSymbols);
        }

        this.globalDispatcher.dispatchEvent(SlotReelsViewSignal.RENDER_SYMBOLS);

        this.notifyComplete();
    }
}