import { BaseAppCommand } from "@flashist/appframework/base/commands/BaseAppCommand";
import { appStorage } from "@flashist/appframework/state/AppStateModule";
import { getInstance } from "@flashist/flibs";
import { GameSymbolId } from "../../../game-slot-reels/data/symbols/GameSymbolId";
import { GameLogicModuleState } from "../../data/state/GameLogicModuleState";
import { GameSlotReelSymbolTools } from "../../../game-slot-reels/tools/GameSlotReelSymbolTools";
import { RemoveAvailableSymbolCommand } from "./RemoveAvailableSymbolCommand";
import {IGameSlotSymbolCompanionVO} from "../../../game-slot-reels/data/symbols/IGameSlotSymbolCompanionVO";

export class AddAvailableSymbolCommand extends BaseAppCommand<IGameSlotSymbolCompanionVO> {

    constructor(protected symbolId: GameSymbolId) {
        super();
    }

    protected executeInternal(): void {
        const gameSymbolTools: GameSlotReelSymbolTools = getInstance(GameSlotReelSymbolTools);
        const createdSymbolCompanion: IGameSlotSymbolCompanionVO = gameSymbolTools.addAvailableSymbolId(this.symbolId);

        let emptyIndex: number = appStorage().getState<GameLogicModuleState>().gameLogic.dynamic.availableSymbolIds.indexOf(GameSymbolId.EMPTY);
        if (emptyIndex !== -1) {
            new RemoveAvailableSymbolCommand(emptyIndex)
                .execute();
        }

        this.notifyComplete(createdSymbolCompanion);
    }

}