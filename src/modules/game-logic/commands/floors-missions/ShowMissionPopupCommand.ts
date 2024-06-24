import {BaseAppCommand} from "@flashist/appframework/base/commands/BaseAppCommand";
import {appStateChangeEvent, appStorage} from "@flashist/appframework/state/AppStateModule";
import {GamePageModuleState} from "../../../game-page/data/state/GamePageModuleState";

export class ShowMissionPopupCommand extends BaseAppCommand {

    protected gameLogicState = appStorage().getState<GamePageModuleState>();

    constructor(protected missionId: string) {
        super();
    }

    protected executeInternal(): void {
        // Open the message popup, to show information about the first goal
        appStorage().change<GamePageModuleState>()("gamePage.popups.mission", true);

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            appStateChangeEvent<GamePageModuleState>()("gamePage.popups.mission"),
            () => {
                if (!this.gameLogicState.gamePage.popups.mission) {
                    this.notifyComplete();
                }
            }
        )

        // this.notifyComplete();
    }

}