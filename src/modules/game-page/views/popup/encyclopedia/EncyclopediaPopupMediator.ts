import { BaseAppMediator } from "@flashist/appframework/base/mediators/BaseAppMediator";
import { appStateChangeEvent, appStorage } from "@flashist/appframework/state/AppStateModule";
import { DragHelperEvent, getInstance, InteractiveEvent, SoundsManager } from "@flashist/flibs";
import { GameLogicTools } from "../../../../game-logic/tools/GameLogicTools";
import { GamePageModuleState } from "../../../data/state/GamePageModuleState";
import { GameLogicModuleState } from "../../../../game-logic/data/state/GameLogicModuleState";
import { EncyclopediaPopupView } from "./EncyclopediaPopupView";
import { IGameSlotSymbolConfigVO } from "../../../../game-slot-reels/data/symbols/IGameSlotSymbolConfigVO";
import { IRarityConfigVO } from "../../../../game-logic/data/rarity/IRarityConfigVO";
import { ISingleSymbolEncyclopediaItemRendererVO } from "./ISingleSymbolEncyclopediaItemRendererVO";
import { SingleSymbolEncyclopediaItemRendererEvent } from "./SingleSymbolEncyclopediaItemRendererEvent";
import { ShowConfigSymbolInfoPopupCommand } from "../../../commands/ShowConfigSymbolInfoPopupCommand";
import { Analytics } from "../../../../analytics/Analytics";
import { AnalyticsEvent } from "../../../../analytics/AnalyticsEvent";
import { GameViewId } from "../../GameViewId";

export class EncyclopediaPopupMediator extends BaseAppMediator<EncyclopediaPopupView> {
    protected gameLogicState = appStorage().getState<GameLogicModuleState>();
    protected gamePageModuleState = appStorage().getState<GamePageModuleState>();
    protected gameLogicTools: GameLogicTools = getInstance(GameLogicTools);
    protected soundsManager: SoundsManager = getInstance(SoundsManager);

    onActivatorStart(activator: EncyclopediaPopupView): void {
        super.onActivatorStart(activator);

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            appStateChangeEvent<GamePageModuleState>()("gamePage.popups.encyclopedia"),
            this.commitActivatorData
        );

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            SingleSymbolEncyclopediaItemRendererEvent.TAP,
            this.onSymbolTap
        );

        this.eventListenerHelper.addEventListener(
            this.activator.closeBtn,
            InteractiveEvent.DOWN,
            this.onCloseBtn
        );

        this.commitActivatorData();
    }

    protected async onSymbolTap(data: ISingleSymbolEncyclopediaItemRendererVO): Promise<void> {
        if (Math.abs(this.activator.symbolsScrollPane.dragHelper.changeDragGlobalY) >= 25) {
            return;
        }

        Analytics.logEvent(AnalyticsEvent.ELEMENT_CLICK, { id: GameViewId.ENCYCLOPEDIA_POPUP_SYMBOL });

        this.soundsManager.getSound("DefaultButtonSound").play();

        new ShowConfigSymbolInfoPopupCommand(data.symbolConfig.id)
            .execute();
    }

    protected onCloseBtn(): void {
        Analytics.logEvent(AnalyticsEvent.ELEMENT_CLICK, { id: GameViewId.ENCYCLOPEDIA_POPUP_CLOSE });

        this.soundsManager.getSound("DefaultButtonSound").play();

        appStorage().change<GamePageModuleState>()("gamePage.popups.encyclopedia", false);
    }

    protected commitActivatorData(): void {
        if (this.gamePageModuleState.gamePage.popups.encyclopedia) {

            const inventorySymbols: ISingleSymbolEncyclopediaItemRendererVO[] = [];

            const allSymbolConfigs: IGameSlotSymbolConfigVO[] = this.gameLogicTools.getAllRaritiesSymbolConfigs();
            for (let singleSymbolConfig of allSymbolConfigs) {
                let singleRarityConfig: IRarityConfigVO = this.gameLogicTools.getRarityConfig(singleSymbolConfig.rarity);

                let isOpen: boolean = false;
                if (this.gameLogicState.gameLogic.dynamicNotResettable.openSymbolIds.indexOf(singleSymbolConfig.id) !== -1) {
                    isOpen = true;
                }

                inventorySymbols.push({
                    symbolConfig: singleSymbolConfig,
                    rarityConfig: singleRarityConfig,
                    isOpen: isOpen
                });
            }

            this.activator.data = {
                inventorySymbols: inventorySymbols
            };

            this.activator.show();

        } else {
            this.activator.hide();
        }
    }
}