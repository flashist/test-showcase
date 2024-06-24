import { BaseAppCommand } from "@flashist/appframework/base/commands/BaseAppCommand";
import { appStorage } from "@flashist/appframework/state/AppStateModule";
import { getInstance } from "@flashist/flibs";
import { GamePageModuleState } from "../../../game-page/data/state/GamePageModuleState";
import { GameLogicTools } from "../../tools/GameLogicTools";
import {Analytics} from "../../../analytics/Analytics";
import {AnalyticsEvent} from "../../../analytics/AnalyticsEvent";
import {IMissionConfigVO} from "../../data/state/IMissionConfigVO";

export class MissionFailCommand extends BaseAppCommand {

    protected gameLogicTools: GameLogicTools = getInstance(GameLogicTools);

    protected executeInternal(): void {
        const activeMission: IMissionConfigVO = this.gameLogicTools.getActiveFloorActiveMission();
        Analytics.logEvent(AnalyticsEvent.MISSION_FAIL, {id: activeMission.id});

        // Open the message popup, to show information about the first goal
        appStorage().change<GamePageModuleState>()("gamePage.popups.gameOver", true);

        this.notifyComplete();
    }

}