import { BaseAppMediator } from "@flashist/appframework/base/mediators/BaseAppMediator";
import { appStateChangeEvent, appStorage } from "@flashist/appframework/state/AppStateModule";
import { getInstance, InteractiveEvent, SoundsManager } from "@flashist/flibs";
import { GameLogicTools } from "../../../../game-logic/tools/GameLogicTools";
import { GamePageModuleState } from "../../../data/state/GamePageModuleState";
import { InventoryPopupView } from "./InventoryPopupView";
import { GameLogicModuleState } from "../../../../game-logic/data/state/GameLogicModuleState";
import { SingleSymbolIventoryItemRendererEvent } from "./SingleSymbolIventoryItemRendererEvent";
import { IGameSlotSymbolCompanionVO } from "../../../../game-slot-reels/data/symbols/IGameSlotSymbolCompanionVO";
import { GameSymbolId } from "../../../../game-slot-reels/data/symbols/GameSymbolId";
import { ShowCompanionSymbolInfoPopupCommand } from "../../../commands/ShowCompanionSymbolInfoPopupCommand";
import { Analytics } from "../../../../analytics/Analytics";
import { AnalyticsEvent } from "../../../../analytics/AnalyticsEvent";
import { GameViewId } from "../../GameViewId";

export class InventoryPopupMediator extends BaseAppMediator<InventoryPopupView> {
    protected gameLogicState = appStorage().getState<GameLogicModuleState>();
    protected gamePageModuleState = appStorage().getState<GamePageModuleState>();
    protected gameLogicTools: GameLogicTools = getInstance(GameLogicTools);
    protected soundsManager: SoundsManager = getInstance(SoundsManager);

    onActivatorStart(activator: InventoryPopupView): void {
        super.onActivatorStart(activator);

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            appStateChangeEvent<GamePageModuleState>()("gamePage.popups.inventory"),
            this.commitActivatorData
        );

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            appStateChangeEvent<GameLogicModuleState>()("gameLogic.dynamic.removes"),
            this.commitActivatorData
        );

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            appStateChangeEvent<GameLogicModuleState>()("gameLogic.dynamic.availableSymbolCompanionDataList"),
            this.commitActivatorData
        );

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            SingleSymbolIventoryItemRendererEvent.TAP,
            this.onSymbolTap
        );

        this.eventListenerHelper.addEventListener(
            this.activator.closeBtn,
            InteractiveEvent.DOWN,
            this.onCloseBtn
        );

        this.commitActivatorData();
    }

    protected async onSymbolTap(data: IGameSlotSymbolCompanionVO): Promise<void> {
        if (Math.abs(this.activator.symbolsScrollPane.dragHelper.changeDragGlobalY) >= 25) {
            return;
        }

        Analytics.logEvent(AnalyticsEvent.ELEMENT_CLICK, { id: GameViewId.INVENTORY_POPUP_SYMBOL });

        this.soundsManager.getSound("DefaultButtonSound").play();

        new ShowCompanionSymbolInfoPopupCommand(data.availableSymbolsIndex)
            .execute();
    }

    protected onCloseBtn(): void {
        Analytics.logEvent(AnalyticsEvent.ELEMENT_CLICK, { id: GameViewId.INVENTORY_POPUP_CLOSE });

        this.soundsManager.getSound("DefaultButtonSound").play();

        appStorage().change<GamePageModuleState>()("gamePage.popups.inventory", false);
    }

    protected commitActivatorData(): void {
        if (this.gamePageModuleState.gamePage.popups.inventory) {

            let symbols: IGameSlotSymbolCompanionVO[] = this.gameLogicState.gameLogic.dynamic.availableSymbolCompanionDataList.concat();
            symbols = symbols.filter(
                (item: IGameSlotSymbolCompanionVO) => {
                    return item.id !== GameSymbolId.EMPTY;
                }
            );

            this.activator.data = {
                symbols: symbols,
                spins: this.gameLogicTools.getSpinsLeftForActiveMission(),
                coins: this.gameLogicTools.getCoinsLeftForActiveMission(),
                removes: this.gameLogicState.gameLogic.dynamic.removes
            };

            this.activator.show();

        } else {
            this.activator.hide();
        }
    }
}