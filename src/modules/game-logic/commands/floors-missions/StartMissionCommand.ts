import {getInstance} from "@flashist/flibs";
import {BaseAppCommand} from "@flashist/appframework/base/commands/BaseAppCommand";
import {appStorage} from "@flashist/appframework/state/AppStateModule";
import {GameLogicModuleState} from "../../data/state/GameLogicModuleState";
import {GameLogicTools} from "../../tools/GameLogicTools";
import {IMissionConfigVO} from "../../data/state/IMissionConfigVO";
import {Analytics} from "../../../analytics/Analytics";
import {AnalyticsEvent} from "../../../analytics/AnalyticsEvent";

export class StartMissionCommand extends BaseAppCommand {

    protected gameLogicTools: GameLogicTools = getInstance(GameLogicTools);

    constructor(protected missionId: string) {
        super();
    }

    protected executeInternal(): void {
        Analytics.logEvent(AnalyticsEvent.MISSION_START, {id: this.missionId});

        // Prepare the game to start the new floor from the scratch
        appStorage().change<GameLogicModuleState>()("gameLogic.dynamic", { missionId: this.missionId, missionSpins: 0 });

        const activeMission: IMissionConfigVO = this.gameLogicTools.getActiveFloorActiveMission();
        if (activeMission.rarity) {
            appStorage().change<GameLogicModuleState>()("gameLogic.dynamic", { baseRarity: activeMission.rarity });
            // TODO: implement re-calculation of the final rarity in a separate method / command
            // to be able to use it whenever chances are changed
            // appStorage().change<GameLogicModuleState>()("gameLogic.dynamic", { finalRarity: activeMission.rarity });
        }

        this.notifyComplete();
    }

}