import {BaseAppMediator} from "@flashist/appframework/base/mediators/BaseAppMediator";
import {appStateChangeEvent, appStorage} from "@flashist/appframework/state/AppStateModule";
import {getInstance, InteractiveEvent, SoundsManager} from "@flashist/flibs";
import {GameLogicTools} from "../../../../game-logic/tools/GameLogicTools";
import {GamePageModuleState} from "../../../data/state/GamePageModuleState";
import {AddSymbolPopupView} from "./AddSymbolPopupView";
import {IGameSlotSymbolConfigVO} from "../../../../game-slot-reels/data/symbols/IGameSlotSymbolConfigVO";
import {AddAvailableSymbolCommand} from "../../../../game-logic/commands/add-symbol/AddAvailableSymbolCommand";
import {GameLogicModuleState} from "../../../../game-logic/data/state/GameLogicModuleState";
import {
    GenerateDataForAddSymbolsAfterSpinCommand
} from "../../../../game-logic/commands/add-symbol/GenerateDataForAddSymbolsAfterSpinCommand";
import {AddSymbolItemRendererEvent} from "./AddSymbolItemRendererEvent";
import {Analytics} from "../../../../analytics/Analytics";
import {AnalyticsEvent} from "../../../../analytics/AnalyticsEvent";
import {GameViewId} from "../../GameViewId";

export class AddSymbolPopupMediator extends BaseAppMediator<AddSymbolPopupView> {
    protected gameLogicState = appStorage().getState<GameLogicModuleState>();
    protected gameLogicTools: GameLogicTools = getInstance(GameLogicTools);
    protected soundsManager: SoundsManager = getInstance(SoundsManager);

    onActivatorStart(activator: AddSymbolPopupView): void {
        super.onActivatorStart(activator);

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            appStateChangeEvent<GamePageModuleState>()("gamePage.popups.addSymbol.visible"),
            this.commitActivatorData
        );

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            appStateChangeEvent<GamePageModuleState>()("gamePage.popups.addSymbol.symbolIds"),
            this.commitActivatorData
        );

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            AddSymbolItemRendererEvent.SELECT,
            this.onSymbolSelect
        );

        this.eventListenerHelper.addEventListener(
            this.activator.rerollBtnView,
            InteractiveEvent.DOWN,
            this.onRerollBtn
        );

        this.eventListenerHelper.addEventListener(
            this.activator.skipBtn,
            InteractiveEvent.DOWN,
            this.onCloseBtn
        );

        this.commitActivatorData();
    }

    protected onSymbolSelect(data: IGameSlotSymbolConfigVO): void {
        Analytics.logEvent(AnalyticsEvent.ADD_SYMBOL, {id: data.id});

        this.soundsManager.getSound("DefaultButtonSound").play();

        new AddAvailableSymbolCommand(data.id)
            .execute()
            .then(
                () => {
                    this.onCloseBtn();
                }
            );
    }

    protected onCloseBtn(): void {
        Analytics.logEvent(AnalyticsEvent.ELEMENT_CLICK, {id: GameViewId.ADD_SYMBOL_POPUP_CLOSE_BUTTON});

        this.soundsManager.getSound("DefaultButtonSound").play();

        appStorage().change<GamePageModuleState>()("gamePage.popups.addSymbol.visible", false);
    }

    protected async onRerollBtn(): Promise<void> {
        Analytics.logEvent(AnalyticsEvent.ELEMENT_CLICK, {id: GameViewId.ADD_SYMBOL_POPUP_SYMBOLS_REROLLS});

        this.soundsManager.getSound("DefaultButtonSound").play();

        appStorage().change<GameLogicModuleState>()(
            "gameLogic.dynamic.rerolls",
            this.gameLogicState.gameLogic.dynamic.rerolls - 1
        );

        await getInstance(GenerateDataForAddSymbolsAfterSpinCommand)
            .execute();

        this.commitActivatorData();
    }

    protected commitActivatorData(): void {
        // this.activator.visible = appStorage().getState<GamePageModuleState>().gamePage.popups.addSymbol.visible;
        if (appStorage().getState<GamePageModuleState>().gamePage.popups.addSymbol.visible) {
            const newSymbolIds = appStorage().getState<GamePageModuleState>().gamePage.popups.addSymbol.symbolIds;
            const newSymbols: IGameSlotSymbolConfigVO[] = this.gameLogicTools.getSymbolConfigsByIds(newSymbolIds);

            // this.activator.setSymbols(newSymbols);
            this.activator.data = {
                symbols: newSymbols,
                spins: this.gameLogicTools.getSpinsLeftForActiveMission(),
                coins: this.gameLogicTools.getCoinsLeftForActiveMission(),
                rerolls: this.gameLogicState.gameLogic.dynamic.rerolls
            };

            this.activator.show();

        } else {
            this.activator.hide();
        }
    }
}