import {BaseAppMediator} from "@flashist/appframework/base/mediators/BaseAppMediator";
import {appStateChangeEvent, appStorage} from "@flashist/appframework/state/AppStateModule";
import {getInstance, InteractiveEvent, SoundsManager} from "@flashist/flibs";
import {GameLogicModuleState} from "../../../../game-logic/data/state/GameLogicModuleState";
import {GameLogicTools} from "../../../../game-logic/tools/GameLogicTools";
import {GamePageModuleState} from "../../../data/state/GamePageModuleState";
import {MissionBonusPopupView} from "./MissionBonusPopupView";
import {IMissionConfigVO} from "../../../../game-logic/data/state/IMissionConfigVO";
import {Analytics} from "../../../../analytics/Analytics";
import {AnalyticsEvent} from "../../../../analytics/AnalyticsEvent";
import {GameViewId} from "../../GameViewId";

export class MissionBonusPopupMediator extends BaseAppMediator<MissionBonusPopupView> {
    protected gameLogicTools: GameLogicTools = getInstance(GameLogicTools);
    protected gameLogicState = appStorage().getState<GameLogicModuleState>();

    protected soundsManager: SoundsManager = getInstance(SoundsManager);

    onActivatorStart(activator: MissionBonusPopupView): void {
        super.onActivatorStart(activator);

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            appStateChangeEvent<GamePageModuleState>()("gamePage.popups.missionBonus"),
            this.commitActivatorData
        );

        this.eventListenerHelper.addEventListener(
            this.activator.closeBtn,
            InteractiveEvent.DOWN,
            this.onCloseBtn
        );

        //
        this.commitActivatorData();
    }

    protected onCloseBtn(): void {
        Analytics.logEvent(AnalyticsEvent.ELEMENT_CLICK, {id: GameViewId.MISSION_POPUP_CLOSE});

        this.soundsManager.getSound("DefaultButtonSound").play();

        appStorage().change<GamePageModuleState>()("gamePage.popups.missionBonus", false);
    }

    protected commitActivatorData(): void {
        if (appStorage().getState<GamePageModuleState>().gamePage.popups.missionBonus) {
            const newActiveMission: IMissionConfigVO = this.gameLogicTools.getActiveFloorActiveMission();

            this.activator.data = {
                rerolls: newActiveMission.startBonus.rerolls,
                removes: newActiveMission.startBonus.removes
            };

            this.activator.show();

        } else {
            this.activator.hide();
        }
    }
}