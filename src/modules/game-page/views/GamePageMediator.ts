import { BaseAppMediator } from "@flashist/appframework/base/mediators/BaseAppMediator";
import {appStateChangeEvent, appStorage} from "@flashist/appframework/state/AppStateModule";
import {getInstance, InteractiveEvent, SoundsManager} from "@flashist/flibs";
import { ReelState } from "../../slot-reels/data/ReelState";
import { SlotReelsModuleState } from "../../slot-reels/data/state/SlotReelsModuleState";
import { SlotReelsUserSignal } from "../../slot-reels/events/SlotReelsUserSignal";
import { SlotReelTools } from "../../slot-reels/tools/SlotReelTools";
import { GamePageModuleState } from "../data/state/GamePageModuleState";
import { GamePageView } from "./GamePageView";
import {GameSlotReelSymbolViewEvent} from "../../game-slot-reels/views/symbols/GameSlotReelSymbolViewEvent";
import {IGameSlotSymbolCompanionVO} from "../../game-slot-reels/data/symbols/IGameSlotSymbolCompanionVO";
import {ShowCompanionSymbolInfoPopupCommand} from "../commands/ShowCompanionSymbolInfoPopupCommand";
import {AnalyticsEvent} from "../../analytics/AnalyticsEvent";
import {GameViewId} from "./GameViewId";
import {Analytics} from "../../analytics/Analytics";

export class GamePageMediator extends BaseAppMediator<GamePageView> {
    protected soundsManager: SoundsManager = getInstance(SoundsManager);

    protected reelsState = appStorage().getState<SlotReelsModuleState>();
    protected gamePageState = appStorage().getState<GamePageModuleState>();

    protected reelTools: SlotReelTools = getInstance(SlotReelTools);

    onActivatorStart(activator: GamePageView): void {
        super.onActivatorStart(activator);

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            appStateChangeEvent<GamePageModuleState>()("gamePage.disableUi"),
            this.commitUiData
        );

        this.eventListenerHelper.addEventListener(
            this.activator.spinBtn,
            InteractiveEvent.DOWN,
            () => {
                Analytics.logEvent(AnalyticsEvent.ELEMENT_CLICK, {id: GameViewId.SPIN_BUTTON});

                this.soundsManager.getSound("SpinButtonSound").play();

                if (this.reelTools.getAllReelsState() !== ReelState.STOPPED) {
                    this.globalDispatcher.dispatchEvent(SlotReelsUserSignal.READY_TO_STOP);
                } else {
                    this.globalDispatcher.dispatchEvent(SlotReelsUserSignal.READY_TO_SPIN);
                }
            }
        );

        this.eventListenerHelper.addEventListener(
            this.activator.inventoryBtn,
            InteractiveEvent.DOWN,
            () => {
                Analytics.logEvent(AnalyticsEvent.ELEMENT_CLICK, {id: GameViewId.INVENTORY_BUTTON});

                this.soundsManager.getSound("DefaultButtonSound").play();

                appStorage().change<GamePageModuleState>()("gamePage.popups.inventory", true);
            }
        );

        this.eventListenerHelper.addEventListener(
            this.activator.encyclopediaBtn,
            InteractiveEvent.DOWN,
            () => {
                Analytics.logEvent(AnalyticsEvent.ELEMENT_CLICK, {id: GameViewId.ENCYCLOPEDIA_BUTTON});

                this.soundsManager.getSound("DefaultButtonSound").play();

                appStorage().change<GamePageModuleState>()("gamePage.popups.encyclopedia", true);
            }
        );

        this.eventListenerHelper.addEventListener(
            this.activator.settingsBtn,
            InteractiveEvent.DOWN,
            () => {
                Analytics.logEvent(AnalyticsEvent.ELEMENT_CLICK, {id: GameViewId.SETTINGS_BUTTON});

                this.soundsManager.getSound("DefaultButtonSound").play();

                appStorage().change<GamePageModuleState>()("gamePage.popups.settings", true);
            }
        );

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            GameSlotReelSymbolViewEvent.TAP,
            (symbolCompanion: IGameSlotSymbolCompanionVO) => {

                // Do nothing if UI is disabled
                if (this.gamePageState.gamePage.disableUi) {
                    return;
                }

                this.soundsManager.getSound("DefaultButtonSound").play();

                new ShowCompanionSymbolInfoPopupCommand(symbolCompanion.availableSymbolsIndex)
                    .execute();
            }
        );

        // Start Workaround:
        // Disable UI for 1 sec to prevent accidental clicking
        appStorage().change<GamePageModuleState>()("gamePage.disableUi", true);
        setTimeout(
            () => {
                appStorage().change<GamePageModuleState>()("gamePage.disableUi", false);
            },
            1000
        )
    }

    protected commitUiData(): void {
        if (this.gamePageState.gamePage.disableUi) {
            this.activator.spinBtn.enabled = false;
            this.activator.inventoryBtn.enabled = false;
            this.activator.encyclopediaBtn.enabled = false;
            this.activator.settingsBtn.enabled = false;

        } else {
            this.activator.spinBtn.enabled = true;
            this.activator.inventoryBtn.enabled = true;
            this.activator.encyclopediaBtn.enabled = true;
            this.activator.settingsBtn.enabled = true;
        }
    }
}