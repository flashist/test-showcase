import {BaseAppCommand} from "@flashist/appframework/base/commands/BaseAppCommand";
import {appStateChangeEvent, appStorage} from "@flashist/appframework/state/AppStateModule";
import {GamePageModuleState} from "../../../game-page/data/state/GamePageModuleState";

export class ShowMissionBonusPopupCommand extends BaseAppCommand {

    protected gameLogicState = appStorage().getState<GamePageModuleState>();

    protected executeInternal(): void {
        // Open the message popup, to show information about the first goal
        appStorage().change<GamePageModuleState>()("gamePage.popups.missionBonus", true);

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            appStateChangeEvent<GamePageModuleState>()("gamePage.popups.missionBonus"),
            () => {
                if (!this.gameLogicState.gamePage.popups.missionBonus) {
                    this.notifyComplete();
                }
            }
        );
    }

}