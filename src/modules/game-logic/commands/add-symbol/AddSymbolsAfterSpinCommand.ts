import { BaseAppCommand } from "@flashist/appframework/base/commands/BaseAppCommand";
import { appStorage } from "@flashist/appframework/state/AppStateModule";
import { DeepReadonly } from "@flashist/appframework/state/data/DeepReadableTypings";
import { ArrayTools } from "@flashist/fcore";
import { getInstance } from "@flashist/flibs";
import { GamePageModuleState } from "../../../game-page/data/state/GamePageModuleState";
import { GameSymbolId } from "../../../game-slot-reels/data/symbols/GameSymbolId";
import { IGameSlotSymbolConfigVO } from "../../../game-slot-reels/data/symbols/IGameSlotSymbolConfigVO";
import { RarityId } from "../../data/rarity/RarityId";
import { GameLogicModuleState } from "../../data/state/GameLogicModuleState";
import { GameLogicTools } from "../../tools/GameLogicTools";
import { WaitAppStorageDataChageCommand } from "../state/WaitAppStorageDataChangeCommand";
import {IMissionConfigVO} from "../../data/state/IMissionConfigVO";
import {GenerateDataForAddSymbolsAfterSpinCommand} from "./GenerateDataForAddSymbolsAfterSpinCommand";

export class AddSymbolsAfterSpinCommand extends BaseAppCommand {
    protected gameLogicState = appStorage().getState<GameLogicModuleState>();
    protected gameLogicTools: GameLogicTools = getInstance(GameLogicTools);

    protected async executeInternal(): Promise<void> {
        await getInstance(GenerateDataForAddSymbolsAfterSpinCommand)
            .execute();

        appStorage().change<GamePageModuleState>()("gamePage.popups.addSymbol.visible", true);

        await new WaitAppStorageDataChageCommand("gamePage.popups.addSymbol.visible", false)
            .execute();

        // Reset data about required rarities
        appStorage().delete<GameLogicModuleState>()("gameLogic.dynamic.nextSpinRequiredRarities");
        appStorage().change<GameLogicModuleState>()("gameLogic.dynamic.nextSpinRequiredRarities", []);

        this.notifyComplete();
    }

}