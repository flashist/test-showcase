import {BaseAppMediator} from "@flashist/appframework/base/mediators/BaseAppMediator";
import {appStateChangeEvent, appStorage} from "@flashist/appframework/state/AppStateModule";
import {getInstance, InteractiveEvent, SoundsManager} from "@flashist/flibs";
import {GameLogicModuleState} from "../../../../game-logic/data/state/GameLogicModuleState";
import {GameLogicTools} from "../../../../game-logic/tools/GameLogicTools";
import {GamePageModuleState} from "../../../data/state/GamePageModuleState";
import {CompanionSymbolInfoPopupView} from "./CompanionSymbolInfoPopupView";
import {SlotReelTools} from "../../../../slot-reels/tools/SlotReelTools";
import {IGameSlotSymbolCompanionVO} from "../../../../game-slot-reels/data/symbols/IGameSlotSymbolCompanionVO";
import {DeepReadonly} from "@flashist/appframework/state/data/DeepReadableTypings";
import {IGameSlotSymbolConfigVO} from "../../../../game-slot-reels/data/symbols/IGameSlotSymbolConfigVO";
import {RemoveAvailableSymbolCommand} from "../../../../game-logic/commands/add-symbol/RemoveAvailableSymbolCommand";
import {GameSymbolId} from "../../../../game-slot-reels/data/symbols/GameSymbolId";
import {Analytics} from "../../../../analytics/Analytics";
import {AnalyticsEvent} from "../../../../analytics/AnalyticsEvent";
import {GameViewId} from "../../GameViewId";

export class CompanionSymbolInfoPopupMediator extends BaseAppMediator<CompanionSymbolInfoPopupView> {
    protected gameLogicTools: GameLogicTools = getInstance(GameLogicTools);
    protected slotReelTools: SlotReelTools = getInstance(SlotReelTools);
    protected gameLogicState = appStorage().getState<GameLogicModuleState>();
    protected gamePageState = appStorage().getState<GamePageModuleState>();
    protected soundsManager: SoundsManager = getInstance(SoundsManager);

    onActivatorStart(activator: CompanionSymbolInfoPopupView): void {
        super.onActivatorStart(activator);

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            appStateChangeEvent<GamePageModuleState>()("gamePage.popups.companionSymbolInfo"),
            this.commitActivatorData
        );

        this.eventListenerHelper.addEventListener(
            this.activator.removeSymbolBtn,
            InteractiveEvent.DOWN,
            this.onRemoveBtn
        );

        this.eventListenerHelper.addEventListener(
            this.activator.closeBtn,
            InteractiveEvent.DOWN,
            this.onCloseBtn
        );

        //
        this.commitActivatorData();
    }

    protected async onRemoveBtn(): Promise<void> {
        Analytics.logEvent(AnalyticsEvent.ELEMENT_CLICK, {id: GameViewId.COMPANION_INFO_POPUP_REMOVE});

        this.soundsManager.getSound("DefaultButtonSound").play();

        if (this.gameLogicState.gameLogic.dynamic.removes <= 0) {
            return;
        }

        Analytics.logEvent(AnalyticsEvent.REMOVE_SYMBOL, {id: this.activator.data.companion.id});

        appStorage().change<GameLogicModuleState>()(
            "gameLogic.dynamic.removes",
            this.gameLogicState.gameLogic.dynamic.removes - 1
        );

        await new RemoveAvailableSymbolCommand(this.activator.data.companion.availableSymbolsIndex)
            .execute();

        this.commitActivatorData();

        //
        this.onCloseBtn();
    }

    protected onCloseBtn(): void {
        Analytics.logEvent(AnalyticsEvent.ELEMENT_CLICK, {id: GameViewId.COMPANION_INFO_POPUP_CLOSE});

        this.soundsManager.getSound("DefaultButtonSound").play();

        appStorage().change<GamePageModuleState>()("gamePage.popups.companionSymbolInfo.visible", false);
    }

    protected commitActivatorData(): void {
        if (this.gamePageState.gamePage.popups.companionSymbolInfo.visible) {
            const companionData: DeepReadonly<IGameSlotSymbolCompanionVO> = this.gameLogicState.gameLogic.dynamic.availableSymbolCompanionDataList[this.gamePageState.gamePage.popups.companionSymbolInfo.companionIndex];
            const config: IGameSlotSymbolConfigVO = this.slotReelTools.getSymbolConfig(companionData.id) as IGameSlotSymbolConfigVO;

            let isRemoveVisible: boolean = false;
            if (config.id !== GameSymbolId.EMPTY) {
                if (this.gameLogicState.gameLogic.dynamic.removes > 0) {
                    isRemoveVisible = true;
                }
            }

            this.activator.data = {
                companion: companionData,
                config: config,
                removeVisible: isRemoveVisible
            };

            this.activator.show();

        } else {
            this.activator.hide();
        }
    }
}