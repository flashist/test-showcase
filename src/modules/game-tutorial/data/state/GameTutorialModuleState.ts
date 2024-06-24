import {GameTutorialStepId} from "../steps/GameTutorialStepId";
import {GameViewId} from "../../../game-page/views/GameViewId";
import {Align, VAlign} from "@flashist/flibs";
import {ITutorialStepConfigVO} from "../../../tutorial/data/state/ITutorialStepConfigVO";

export const GameTutorialModuleInitialState = {
    tutorial: {
        static: {
            steps: {
                [GameTutorialStepId.FIRST_MISSION_GOAL]: {
                    id: GameTutorialStepId.FIRST_MISSION_GOAL,
                    textId: "tutorial.steps.firstMissionGoal",
                    viewId: GameViewId.MISSION_POPUP_GOAL,
                    valign: VAlign.BOTTOM,
                    labelAlign: Align.CENTER,

                    minTimeToDisplayMs: 2000,
                    blocking: true
                },
                [GameTutorialStepId.FIRST_MISSION_CLOSE]: {
                    id: GameTutorialStepId.FIRST_MISSION_CLOSE,
                    completeSaveStepId: GameTutorialStepId.FIRST_MISSION_GOAL,

                    textId: "tutorial.steps.firstMissionClose",
                    viewId: GameViewId.MISSION_POPUP_CLOSE,
                    valign: VAlign.TOP,
                    labelAlign: Align.CENTER
                },

                [GameTutorialStepId.FIRST_SPIN]: {
                    id: GameTutorialStepId.FIRST_SPIN,
                    completeSaveStepId: GameTutorialStepId.FIRST_SPIN,

                    textId: "tutorial.steps.firstSpin",
                    viewId: GameViewId.SPIN_BUTTON,
                    requiredCompleteStepIds: [GameTutorialStepId.FIRST_MISSION_GOAL],
                    valign: VAlign.TOP,
                    labelAlign: Align.CENTER
                },

                [GameTutorialStepId.FIRST_WIN]: {
                    id: GameTutorialStepId.FIRST_WIN,
                    completeSaveStepId: GameTutorialStepId.FIRST_WIN,

                    textId: "tutorial.steps.firstWin",
                    viewId: GameViewId.REELS_COINS,
                    requiredCompleteStepIds: [GameTutorialStepId.FIRST_SPIN],
                    valign: VAlign.BOTTOM,
                    labelAlign: Align.CENTER,

                    blocking: true
                },

                [GameTutorialStepId.FIRST_ADD_SYMBOL_INTRO]: {
                    id: GameTutorialStepId.FIRST_ADD_SYMBOL_INTRO,
                    textId: "tutorial.steps.firstAddSymbolIntro",
                    viewId: GameViewId.ADD_SYMBOL_POPUP_TITLE,
                    requiredCompleteStepIds: [GameTutorialStepId.FIRST_WIN],
                    valign: VAlign.BOTTOM,
                    labelAlign: Align.CENTER,

                    blocking: true
                },
                [GameTutorialStepId.FIRST_ADD_SYMBOL_SINGLE_SYMBOL_VALUE]: {
                    id: GameTutorialStepId.FIRST_ADD_SYMBOL_SINGLE_SYMBOL_VALUE,
                    textId: "tutorial.steps.firstAddSymbolSingleSymbolValue",
                    viewId: GameViewId.ADD_SYMBOL_POPUP_FIRST_SYMBOL_VALUE,
                    valign: VAlign.BOTTOM,
                    labelAlign: Align.LEFT,

                    blocking: true
                },
                [GameTutorialStepId.FIRST_ADD_SYMBOL_SINGLE_SYMBOL_DESC]: {
                    id: GameTutorialStepId.FIRST_ADD_SYMBOL_SINGLE_SYMBOL_DESC,
                    textId: "tutorial.steps.firstAddSymbolSingleSymbolDesc",
                    viewId: GameViewId.ADD_SYMBOL_POPUP_FIRST_SYMBOL,
                    valign: VAlign.BOTTOM,
                    labelAlign: Align.CENTER,

                    blocking: true
                },
                [GameTutorialStepId.FIRST_ADD_SYMBOL_ACTION]: {
                    id: GameTutorialStepId.FIRST_ADD_SYMBOL_ACTION,
                    completeSaveStepId: GameTutorialStepId.FIRST_ADD_SYMBOL_INTRO,
                    textId: "tutorial.steps.firstAddSymbolSingleSymbolAction",
                    viewId: GameViewId.ADD_SYMBOL_POPUP_SYMBOLS,
                    valign: VAlign.TOP,
                    labelAlign: Align.CENTER
                },

                [GameTutorialStepId.FIRST_MISSION_BONUS_INTRO]: {
                    id: GameTutorialStepId.FIRST_MISSION_BONUS_INTRO,
                    completeSaveStepId: GameTutorialStepId.FIRST_MISSION_BONUS_INTRO,
                    requiredCompleteStepIds: [GameTutorialStepId.FIRST_ADD_SYMBOL_INTRO],

                    textId: "tutorial.steps.firstMissionBonusIntro",
                    viewId: GameViewId.MISSION_BONUS_POPUP_BONUSES,
                    valign: VAlign.BOTTOM,
                    labelAlign: Align.CENTER,

                    blocking: true
                },
                [GameTutorialStepId.FIRST_MISSION_BONUS_REROLLS]: {
                    id: GameTutorialStepId.FIRST_MISSION_BONUS_REROLLS,
                    completeSaveStepId: GameTutorialStepId.FIRST_MISSION_BONUS_REROLLS,
                    requiredCompleteStepIds: [GameTutorialStepId.FIRST_MISSION_BONUS_INTRO],

                    textId: "tutorial.steps.firstMissionBonusRerolls",
                    viewId: GameViewId.ADD_SYMBOL_POPUP_SYMBOLS_REROLLS,
                    valign: VAlign.BOTTOM,
                    labelAlign: Align.CENTER,

                    blocking: true
                },

                [GameTutorialStepId.FIRST_REMOVE_INTRO]: {
                    id: GameTutorialStepId.FIRST_REMOVE_INTRO,
                    completeSaveStepId: GameTutorialStepId.FIRST_REMOVE_INTRO,
                    requiredCompleteStepIds: [GameTutorialStepId.FIRST_MISSION_BONUS_REROLLS],

                    textId: "tutorial.steps.firstRemoveIntro",
                    viewId: GameViewId.INVENTORY_BUTTON,
                    align: Align.LEFT,
                    valign: VAlign.TOP,
                    labelAlign: Align.RIGHT,
                },
                [GameTutorialStepId.FIRST_REMOVE_SYMBOL_INFO]: {
                    id: GameTutorialStepId.FIRST_REMOVE_SYMBOL_INFO,
                    completeSaveStepId: GameTutorialStepId.FIRST_REMOVE_SYMBOL_INFO,
                    requiredCompleteStepIds: [GameTutorialStepId.FIRST_REMOVE_INTRO],

                    textId: "tutorial.steps.firstRemoveSymbolInfo",
                    viewId: GameViewId.INVENTORY_POPUP_FIRST_SYMBOL,
                    align: Align.RIGHT,
                    valign: VAlign.BOTTOM,
                    labelAlign: Align.LEFT
                },
                [GameTutorialStepId.FIRST_REMOVE_SINGLE_SYMBOL_REMOVE_BUTTON]: {
                    id: GameTutorialStepId.FIRST_REMOVE_SINGLE_SYMBOL_REMOVE_BUTTON,
                    completeSaveStepId: GameTutorialStepId.FIRST_REMOVE_SINGLE_SYMBOL_REMOVE_BUTTON,
                    requiredCompleteStepIds: [GameTutorialStepId.FIRST_REMOVE_SYMBOL_INFO],

                    textId: "tutorial.steps.firstRemoveSymbolButton",
                    viewId: GameViewId.COMPANION_INFO_POPUP_REMOVE,
                    align: Align.LEFT,
                    valign: VAlign.BOTTOM,
                    labelAlign: Align.RIGHT
                },

            } as Record<string, ITutorialStepConfigVO>
        }
    }
}