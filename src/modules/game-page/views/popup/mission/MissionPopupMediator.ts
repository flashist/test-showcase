import {BaseAppMediator} from "@flashist/appframework/base/mediators/BaseAppMediator";
import {appStateChangeEvent, appStorage} from "@flashist/appframework/state/AppStateModule";
import {getInstance, InteractiveEvent, SoundsManager} from "@flashist/flibs";
import {GameLogicModuleState} from "../../../../game-logic/data/state/GameLogicModuleState";
import {GameLogicTools} from "../../../../game-logic/tools/GameLogicTools";
import {GamePageModuleState} from "../../../data/state/GamePageModuleState";
import {MissionPopupView} from "./MissionPopupView";
import {Analytics} from "../../../../analytics/Analytics";
import {AnalyticsEvent} from "../../../../analytics/AnalyticsEvent";
import {GameViewId} from "../../GameViewId";

export class MissionPopupMediator extends BaseAppMediator<MissionPopupView> {
    protected gameLogicTools: GameLogicTools = getInstance(GameLogicTools);
    protected soundsManager: SoundsManager = getInstance(SoundsManager);

    onActivatorStart(activator: MissionPopupView): void {
        super.onActivatorStart(activator);

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            appStateChangeEvent<GamePageModuleState>()("gamePage.popups.mission"),
            this.commitVisibleData
        );

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            appStateChangeEvent<GameLogicModuleState>()("gameLogic.dynamic.floorId"),
            this.commitMessageData
        );

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            appStateChangeEvent<GameLogicModuleState>()("gameLogic.dynamic.missionId"),
            this.commitMessageData
        );

        this.eventListenerHelper.addEventListener(
            this.activator.closeBtn,
            InteractiveEvent.DOWN,
            this.onCloseBtn
        );

        this.commitVisibleData();
        this.commitMessageData();
    }

    protected onCloseBtn(): void {
        Analytics.logEvent(AnalyticsEvent.ELEMENT_CLICK, {id: GameViewId.MISSION_POPUP_CLOSE});

        this.soundsManager.getSound("DefaultButtonSound").play();

        appStorage().change<GamePageModuleState>()("gamePage.popups.mission", false);
    }

    protected commitVisibleData(): void {
        // this.activator.visible = appStorage().getState<GamePageModuleState>().gamePage.popups.mission;
        if (appStorage().getState<GamePageModuleState>().gamePage.popups.mission) {
            this.activator.show();

        } else {
            this.activator.hide();
        }
    }

    protected commitMessageData(): void {
        this.activator.data = this.gameLogicTools.getActiveFloorActiveMission();
    }
}