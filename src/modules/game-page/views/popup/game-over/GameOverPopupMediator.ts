import {BaseAppMediator} from "@flashist/appframework/base/mediators/BaseAppMediator";
import {appStateChangeEvent, appStorage} from "@flashist/appframework/state/AppStateModule";
import {getInstance, InteractiveEvent, SoundsManager} from "@flashist/flibs";
import {GameLogicModuleState} from "../../../../game-logic/data/state/GameLogicModuleState";
import {GameLogicTools} from "../../../../game-logic/tools/GameLogicTools";
import {GamePageModuleState} from "../../../data/state/GamePageModuleState";
import {GameOverPopupView} from "./GameOverPopupView";
import {RestartFloorCommand} from "../../../../game-logic/commands/floors-missions/RestartFloorCommand";
import {Analytics} from "../../../../analytics/Analytics";
import {AnalyticsEvent} from "../../../../analytics/AnalyticsEvent";
import {GameViewId} from "../../GameViewId";

export class GameOverPopupMediator extends BaseAppMediator<GameOverPopupView> {
    protected gameLogicTools: GameLogicTools = getInstance(GameLogicTools);
    protected soundsManager: SoundsManager = getInstance(SoundsManager);

    onActivatorStart(activator: GameOverPopupView): void {
        super.onActivatorStart(activator);

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            appStateChangeEvent<GamePageModuleState>()("gamePage.popups.gameOver"),
            this.commitVisibleData
        );

        this.eventListenerHelper.addEventListener(
            this.activator.closeBtn,
            InteractiveEvent.DOWN,
            this.onCloseBtn
        );

        //
        this.commitVisibleData();
    }

    protected commitVisibleData(): void {
        this.activator.data = this.gameLogicTools.getActiveFloorActiveMission();

        if (appStorage().getState<GamePageModuleState>().gamePage.popups.gameOver) {
            this.activator.show();
        } else {
            this.activator.hide();
        }
    }

    protected async onCloseBtn(): Promise<void> {
        Analytics.logEvent(AnalyticsEvent.ELEMENT_CLICK, {id: GameViewId.GAME_OVER_POPUP_CLOSE});

        this.soundsManager.getSound("DefaultButtonSound").play();

        await getInstance(
            RestartFloorCommand,
            appStorage().getState<GameLogicModuleState>().gameLogic.dynamic.floorId
        ).execute();
    }
}