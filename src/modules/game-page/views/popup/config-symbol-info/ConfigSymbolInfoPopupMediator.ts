import {BaseAppMediator} from "@flashist/appframework/base/mediators/BaseAppMediator";
import {appStateChangeEvent, appStorage} from "@flashist/appframework/state/AppStateModule";
import {getInstance, InteractiveEvent, SoundsManager} from "@flashist/flibs";
import {GameLogicModuleState} from "../../../../game-logic/data/state/GameLogicModuleState";
import {GameLogicTools} from "../../../../game-logic/tools/GameLogicTools";
import {GamePageModuleState} from "../../../data/state/GamePageModuleState";
import {IGameSlotSymbolConfigVO} from "../../../../game-slot-reels/data/symbols/IGameSlotSymbolConfigVO";
import {ConfigSymbolInfoPopupView} from "./ConfigSymbolInfoPopupView";
import {Analytics} from "../../../../analytics/Analytics";
import {AnalyticsEvent} from "../../../../analytics/AnalyticsEvent";
import {GameViewId} from "../../GameViewId";

export class ConfigSymbolInfoPopupMediator extends BaseAppMediator<ConfigSymbolInfoPopupView> {
    protected gameLogicTools: GameLogicTools = getInstance(GameLogicTools);
    protected gameLogicState = appStorage().getState<GameLogicModuleState>();
    protected gamePageState = appStorage().getState<GamePageModuleState>();
    protected soundsManager: SoundsManager = getInstance(SoundsManager);

    onActivatorStart(activator: ConfigSymbolInfoPopupView): void {
        super.onActivatorStart(activator);

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            appStateChangeEvent<GamePageModuleState>()("gamePage.popups.configSymbolInfo"),
            this.commitActivatorData
        );

        this.eventListenerHelper.addEventListener(
            this.activator.closeBtn,
            InteractiveEvent.DOWN,
            this.onCloseBtn
        );

        this.commitActivatorData();
    }

    protected onCloseBtn(): void {
        Analytics.logEvent(AnalyticsEvent.ELEMENT_CLICK, {id: GameViewId.CONFIG_INFO_POPUP_CLOSE});

        this.soundsManager.getSound("DefaultButtonSound").play();

        appStorage().change<GamePageModuleState>()("gamePage.popups.configSymbolInfo.visible", false);
    }

    protected commitActivatorData(): void {
        if (this.gamePageState.gamePage.popups.configSymbolInfo.visible) {
            const symbolConfig: IGameSlotSymbolConfigVO = this.gameLogicTools.getSymbolConfigsByIds([this.gamePageState.gamePage.popups.configSymbolInfo.symbolId])[0];
            this.activator.data = symbolConfig;

            this.activator.show();

        } else {
            this.activator.hide();
        }
    }
}