import {BaseAppMediator} from "@flashist/appframework/base/mediators/BaseAppMediator";
import {appStateChangeEvent, appStorage} from "@flashist/appframework/state/AppStateModule";
import {getInstance, InteractiveEvent, SoundsManager, SoundsManagerEvent} from "@flashist/flibs";
import {GameLogicTools} from "../../../../game-logic/tools/GameLogicTools";
import {GamePageModuleState} from "../../../data/state/GamePageModuleState";
import {SettingsPopupView} from "./SettingsPopupView";
import {Analytics} from "../../../../analytics/Analytics";
import {AnalyticsEvent} from "../../../../analytics/AnalyticsEvent";
import {GameViewId} from "../../GameViewId";

export class SettingsPopupMediator extends BaseAppMediator<SettingsPopupView> {
    protected gameLogicTools: GameLogicTools = getInstance(GameLogicTools);
    protected soundsManager: SoundsManager = getInstance(SoundsManager);

    onActivatorStart(activator: SettingsPopupView): void {
        super.onActivatorStart(activator);

        this.eventListenerHelper.addEventListener(
            this.soundsManager,
            SoundsManagerEvent.IS_MUTED_CHANGE,
            this.commitActivatorData
        );

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            appStateChangeEvent<GamePageModuleState>()("gamePage.popups.settings"),
            this.commitActivatorData
        );

        this.eventListenerHelper.addEventListener(
            this.activator.soundBtnCont,
            InteractiveEvent.DOWN,
            this.onSoundBtn
        );

        this.eventListenerHelper.addEventListener(
            this.activator.closeBtn,
            InteractiveEvent.DOWN,
            this.onCloseBtn
        );

        this.commitActivatorData();
    }

    protected onCloseBtn(): void {
        Analytics.logEvent(AnalyticsEvent.ELEMENT_CLICK, {id: GameViewId.SETTINGS_POPUP_CLOSE});

        this.soundsManager.getSound("DefaultButtonSound").play();

        appStorage().change<GamePageModuleState>()("gamePage.popups.settings", false);
    }

    protected onSoundBtn(): void {
        Analytics.logEvent(AnalyticsEvent.ELEMENT_CLICK, {id: GameViewId.SETTINGS_POPUP_SOUND});

        this.soundsManager.getSound("DefaultButtonSound").play();

        this.soundsManager.isMuted = !this.soundsManager.isMuted;
    }

    protected commitActivatorData(): void {
        if (appStorage().getState<GamePageModuleState>().gamePage.popups.settings) {
            this.activator.show();

            this.activator.soundBtnImage.selected = !this.soundsManager.isMuted;

        } else {
            this.activator.hide();
        }
    }
}