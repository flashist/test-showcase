import { BaseAppCommand } from "@flashist/appframework/base/commands/BaseAppCommand";
import { appStorage } from "@flashist/appframework/state/AppStateModule";
import { getInstance } from "@flashist/flibs";
import { Analytics } from "../../../analytics/Analytics";
import { AnalyticsEvent } from "../../../analytics/AnalyticsEvent";
import { GameLogicModuleState } from "../../data/state/GameLogicModuleState";
import { IMissionConfigVO } from "../../data/state/IMissionConfigVO";
import { GameLogicTools } from "../../tools/GameLogicTools";
import { ShowMissionBonusPopupCommand } from "./ShowMissionBonusPopupCommand";
import { ShowMissionPopupCommand } from "./ShowMissionPopupCommand";
import { StartMissionCommand } from "./StartMissionCommand";

export class MissionSuccessCommand extends BaseAppCommand {

    protected gameLogicState = appStorage().getState<GameLogicModuleState>();
    protected gameLogicTools: GameLogicTools = getInstance(GameLogicTools);

    protected async executeInternal(): Promise<void> {
        const activeMission: IMissionConfigVO = this.gameLogicTools.getActiveFloorActiveMission();

        Analytics.logEvent(AnalyticsEvent.MISSION_SUCCESS, {id: activeMission.id});

        const newCoins: number = this.gameLogicState.gameLogic.dynamic.coins - activeMission.coins;
        appStorage().change<GameLogicModuleState>()(
            "gameLogic.dynamic.coins",
            newCoins
        );

        // Start new mission
        const gameLogicTools: GameLogicTools = getInstance(GameLogicTools);
        const nextMissionId: string = gameLogicTools.getActiveFloorNextMissionId();
        await getInstance(StartMissionCommand, nextMissionId)
            .execute();

        await getInstance(ShowMissionPopupCommand, nextMissionId)
            .execute();

        const newActiveMission: IMissionConfigVO = this.gameLogicTools.getActiveFloorActiveMission();
        if (newActiveMission.startBonus) {
            if (newActiveMission.startBonus.rerolls || newActiveMission.startBonus.removes) {
                appStorage().change<GameLogicModuleState>()("gameLogic.dynamic.removes", this.gameLogicState.gameLogic.dynamic.removes + newActiveMission.startBonus.removes);
                appStorage().change<GameLogicModuleState>()("gameLogic.dynamic.rerolls", this.gameLogicState.gameLogic.dynamic.rerolls + newActiveMission.startBonus.rerolls);

                await getInstance(ShowMissionBonusPopupCommand)
                    .execute();
            }
        }

        // TODO: show popup to add item

        // Add symbol

        // Open the message popup, to show information about the first goal
        // appStorage().change<GamePageModuleState>()("gamePage.popups.gameOver", true);

        this.notifyComplete();
    }

}