import {BaseAppManager} from "@flashist/appframework/base/managers/BaseAppManager";
import {appStateChangeEvent, appStorage} from "@flashist/appframework/state/AppStateModule";
import {GamePageModuleState} from "../../game-page/data/state/GamePageModuleState";
import {GameTutorialStepId} from "../data/steps/GameTutorialStepId";
import {TutorialManager} from "../../tutorial/managers/TutorialManager";
import {getInstance} from "@flashist/flibs";
import {SlotTimeoutTools} from "../../slot-tools/SlotTimeoutTools";
import {TimeoutTools} from "@flashist/flibs/timeout/tools/TimeoutTools";
import {GameSlotReelSymbolTools} from "../../game-slot-reels/tools/GameSlotReelSymbolTools";
import {GameSymbolId} from "../../game-slot-reels/data/symbols/GameSymbolId";
import {GameLogicModuleState} from "../../game-logic/data/state/GameLogicModuleState";

export class GameTutorialManager extends BaseAppManager {

    protected gamePageState = appStorage().getState<GamePageModuleState>();
    protected gameLogicState = appStorage().getState<GameLogicModuleState>();
    protected tutorialManager: TutorialManager = getInstance(TutorialManager);
    protected gameSymbolTools: GameSlotReelSymbolTools = getInstance(GameSlotReelSymbolTools);

    protected addListeners() {
        super.addListeners();

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            appStateChangeEvent<GamePageModuleState>()("gamePage.popups.mission"),
            async () => {

                // Next frame timeout is needed to make sure other views are initiated
                await TimeoutTools.asyncTimeout(0);

                if (this.gamePageState.gamePage.popups.mission) {
                    if (this.tutorialManager.checkIfStepCanBeStarted(GameTutorialStepId.FIRST_MISSION_GOAL)) {
                        await this.tutorialManager.startStep(GameTutorialStepId.FIRST_MISSION_GOAL);
                        await this.tutorialManager.startStep(GameTutorialStepId.FIRST_MISSION_CLOSE);
                    }

                // When the mission popup closed for the 1st time
                } else {
                    await this.tutorialManager.startStep(GameTutorialStepId.FIRST_SPIN);
                }
            }
        );

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            appStateChangeEvent<GamePageModuleState>()("gamePage.popups.addSymbol"),
            async () => {
                // Next frame timeout is needed to make sure other views are initiated
                await TimeoutTools.asyncTimeout(0);

                if (this.gamePageState.gamePage.popups.addSymbol.visible) {
                    if (this.tutorialManager.checkIfStepCanBeStarted(GameTutorialStepId.FIRST_ADD_SYMBOL_INTRO)) {
                        await this.tutorialManager.startStep(GameTutorialStepId.FIRST_ADD_SYMBOL_INTRO);
                        await this.tutorialManager.startStep(GameTutorialStepId.FIRST_ADD_SYMBOL_SINGLE_SYMBOL_VALUE);
                        await this.tutorialManager.startStep(GameTutorialStepId.FIRST_ADD_SYMBOL_SINGLE_SYMBOL_DESC);
                        await this.tutorialManager.startStep(GameTutorialStepId.FIRST_ADD_SYMBOL_ACTION);

                    } else if (this.tutorialManager.checkIfStepCanBeStarted(GameTutorialStepId.FIRST_MISSION_BONUS_REROLLS)) {
                        await this.tutorialManager.startStep(GameTutorialStepId.FIRST_MISSION_BONUS_REROLLS);
                    }

                } else {
                    if (this.tutorialManager.checkIfStepCanBeStarted(GameTutorialStepId.FIRST_REMOVE_INTRO)) {
                        const nonEmptySymbols: string[] = this.gameSymbolTools.findAvailableSymbols([GameSymbolId.EMPTY]);
                        if (nonEmptySymbols.length > this.gameSymbolTools.getOnReelsSymbolsTotalCount()) {
                            await this.tutorialManager.startStep(GameTutorialStepId.FIRST_REMOVE_INTRO);
                        }
                    }
                }
            }
        );


        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            appStateChangeEvent<GamePageModuleState>()("gamePage.popups.missionBonus"),
            async () => {
                // Next frame timeout is needed to make sure other views are initiated
                await TimeoutTools.asyncTimeout(0);

                if (this.gamePageState.gamePage.popups.missionBonus) {
                    await this.tutorialManager.startStep(GameTutorialStepId.FIRST_MISSION_BONUS_INTRO);
                }
            }
        );

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            appStateChangeEvent<GamePageModuleState>()("gamePage.popups.inventory"),
            async () => {
                // Next frame timeout is needed to make sure other views are initiated
                await TimeoutTools.asyncTimeout(0);

                if (this.gamePageState.gamePage.popups.inventory) {
                    await this.tutorialManager.startStep(GameTutorialStepId.FIRST_REMOVE_SYMBOL_INFO);
                }
            }
        );

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            appStateChangeEvent<GamePageModuleState>()("gamePage.popups.companionSymbolInfo.visible"),
            async () => {
                // Next frame timeout is needed to make sure other views are initiated
                await TimeoutTools.asyncTimeout(0);

                if (this.gamePageState.gamePage.popups.companionSymbolInfo.visible) {
                    if (this.gameLogicState.gameLogic.dynamic.removes > 0) {
                        await this.tutorialManager.startStep(GameTutorialStepId.FIRST_REMOVE_SINGLE_SYMBOL_REMOVE_BUTTON);
                    }
                }
            }
        );
    }
}