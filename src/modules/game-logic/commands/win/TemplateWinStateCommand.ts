import {DeepReadonly} from "@flashist/appframework";
import {BaseAppCommand} from "@flashist/appframework/base/commands/BaseAppCommand";
import {appStorage} from "@flashist/appframework/state/AppStateModule";
import {getInstance, SoundsManager} from "@flashist/flibs";
import {TimeoutTools} from "@flashist/flibs/timeout/tools/TimeoutTools";
import {
    GameSlotSymbolInteractionTriggerType
} from "../../../game-slot-reels/data/interactions/GameSlotSymbolInteractionTriggerType";
import {GameSlotReelsModuleViewState} from "../../../game-slot-reels/data/state/GameSlotReelsModuleViewState";
import {GameSlotSymbolViewState} from "../../../game-slot-reels/data/symbols/GameSlotSymbolViewState";
import {IGameReelSymbolVO} from "../../../game-slot-reels/data/symbols/IGameReelSymbolVO";
import {IGameSlotSymbolCompanionVO} from "../../../game-slot-reels/data/symbols/IGameSlotSymbolCompanionVO";
import {GameSlotReelSymbolTools} from "../../../game-slot-reels/tools/GameSlotReelSymbolTools";
import {SlotReelsModuleState} from "../../../slot-reels/data/state/SlotReelsModuleState";
import {IReelSymbolPositionVO} from "../../../slot-reels/data/symbols/IReelSymbolPositionVO";
import {SlotReelTools} from "../../../slot-reels/tools/SlotReelTools";
import {SlotReelsViewSignal} from "../../../slot-reels/views/SlotReelsViewSignal";
import {
    WaitSymbolViewsToCompleteAnimation
} from "../../../slot-symbol-views/commands/WaitSymbolViewsToCompleteAnimation";
import {IGameSymbolWinActionVO} from "../../data/interaction/IGameSymbolWinActionVO";
import {IGameSymbolWinInteractionVO} from "../../data/interaction/IGameSymbolWinInteractionVO";
import {GameLogicModuleState} from "../../data/state/GameLogicModuleState";
import {SlotGameSymbolWinValueAnimationsManager} from "../../managers/SlotGameSymbolWinValueAnimationsManager";
import {ISymbolCoinAnimationVO} from "../../managers/ISymbolCoinAnimationVO";
import {GameLogicTools} from "../../tools/GameLogicTools";
import {GameSymbolInteractionTools} from "../../tools/GameSymbolInteractionTools";
import {AddAvailableSymbolCommand} from "../add-symbol/AddAvailableSymbolCommand";
import {TutorialManager} from "../../../tutorial/managers/TutorialManager";
import {GameTutorialStepId} from "../../../game-tutorial/data/steps/GameTutorialStepId";
import {Analytics} from "../../../analytics/Analytics";
import {AnalyticsEvent} from "../../../analytics/AnalyticsEvent";

export class TemplateWinStateCommand extends BaseAppCommand {
    protected gameLogicState = appStorage().getState<GameLogicModuleState>();
    protected reelsState = appStorage().getState<SlotReelsModuleState>();
    protected gameReelsViewState = appStorage().getState<GameSlotReelsModuleViewState>();

    protected reelTools: SlotReelTools = getInstance(SlotReelTools);
    protected gameLogicTools: GameLogicTools = getInstance(GameLogicTools);
    protected interactionTools: GameSymbolInteractionTools = getInstance(GameSymbolInteractionTools);
    protected gameReelTools: GameSlotReelSymbolTools = getInstance(GameSlotReelSymbolTools);
    protected soundsManager: SoundsManager = getInstance(SoundsManager);

    protected symbolWinAnimationsManager: SlotGameSymbolWinValueAnimationsManager = getInstance(SlotGameSymbolWinValueAnimationsManager);
    protected tutorialManager: TutorialManager = getInstance(TutorialManager);

    protected coinsValueToSetNextFrame: number;
    protected removesValueToSetNextFrame: number;
    protected rerollsValueToSetNextFrame: number;

    protected positionToModificationsMap: { [reelIndex: number]: { [rowIndex: number]: IWinModifierVO } };
    protected positionsToDelete: IReelSymbolPositionVO[];

    protected async executeInternal(): Promise<void> {
        this.coinsValueToSetNextFrame = this.gameLogicState.gameLogic.dynamic.coins;
        this.removesValueToSetNextFrame = this.gameLogicState.gameLogic.dynamic.removes;
        this.rerollsValueToSetNextFrame = this.gameLogicState.gameLogic.dynamic.rerolls;

        // Reset data before calculating wins
        appStorage().delete<GameLogicModuleState>()("gameLogic.dynamic.curReelsRarityModCoefs");
        appStorage().change<GameLogicModuleState>()("gameLogic.dynamic.curReelsRarityModCoefs", {});

        let totalWin: number = 0;

        this.gameLogicTools.increaseTimesOnReelsForCurrentNonExtendedSymbols();

        const curSymbols: IGameReelSymbolVO[][] = this.reelTools.getCurrentNonExtendedSymbols() as IGameReelSymbolVO[][];

        this.positionToModificationsMap = {};
        this.positionsToDelete = [];

        await this.interactionTools.calculateWinInteractions(
            curSymbols,
            GameSlotSymbolInteractionTriggerType.ON_REELS,
            (winInteractionsGroup: IGameSymbolWinInteractionVO[]) => {
                return this.processWinInteractionsGroup(winInteractionsGroup, GameSlotSymbolViewState.INTERACTION);
            }
        );

        // Play destroying animations
        //
        // Filter positions to delete and leave only unique ones
        this.positionsToDelete = this.positionsToDelete.filter(
            (item: IReelSymbolPositionVO, index: number, array: IReelSymbolPositionVO[]): boolean => {
                let result: boolean = true;

                for (let checkIndex: number = 0; checkIndex < index; checkIndex++) {
                    const checkPos: IReelSymbolPositionVO = array[checkIndex];
                    if (checkPos.x === item.x && checkPos.y === item.y) {
                        result = false;
                        break;
                    }
                }

                return result;
            }
        );
        const reelSymbolsToDelete: IGameReelSymbolVO[][] = [];
        for (let singleSymbolToDeletePos of this.positionsToDelete) {
            appStorage().change<GameSlotReelsModuleViewState>()(
                `slotView.extendedReelSymbolsData.${singleSymbolToDeletePos.x}.${singleSymbolToDeletePos.y}`,
                { viewState: GameSlotSymbolViewState.DESTROYING }
            );

            const tempSymbolToDelete: IGameReelSymbolVO = this.gameReelsViewState.slotView.extendedReelSymbolsData[singleSymbolToDeletePos.x][singleSymbolToDeletePos.y];

            if (!reelSymbolsToDelete[singleSymbolToDeletePos.x]) {
                reelSymbolsToDelete[singleSymbolToDeletePos.x] = [];
            }
            reelSymbolsToDelete[singleSymbolToDeletePos.x][singleSymbolToDeletePos.y] = tempSymbolToDelete;
        }
        //
        const deleteWinInteractions: IGameSymbolWinInteractionVO[] = await this.interactionTools.calculateWinInteractions(
            reelSymbolsToDelete,
            GameSlotSymbolInteractionTriggerType.ON_DESTROY,
            (winInteractionsGroup: IGameSymbolWinInteractionVO[]) => {
                return this.processWinInteractionsGroup(winInteractionsGroup);
            }
        );
        //
        this.globalDispatcher.dispatchEvent(SlotReelsViewSignal.RENDER_SYMBOLS);
        //
        await new WaitSymbolViewsToCompleteAnimation(this.positionsToDelete)
            .execute();

        const winDataPerValueMap: Record<number, ISymbolCoinAnimationVO[]> = {};
        for (let reelSymbols of curSymbols) {
            for (let singleSymbol of reelSymbols) {

                const tempWinData: ISymbolCoinAnimationVO = {
                    x: singleSymbol.position.x,
                    y: singleSymbol.position.y,
                    coinsValue: this.gameLogicTools.getReelSymbolTotalValue(singleSymbol),
                    removesValue: 0,
                    rerollsValue: 0
                };

                let tempMod: IWinModifierVO;
                if (this.positionToModificationsMap[singleSymbol.position.x]?.[singleSymbol.position.y]) {
                    tempMod = this.positionToModificationsMap[singleSymbol.position.x][singleSymbol.position.y];

                    if (tempMod.coinsValue) {
                        tempWinData.coinsValue += tempMod.coinsValue;
                    }
                    if (tempMod.coinsCoef || tempMod.coinsCoef === 0) {
                        tempWinData.coinsValue *= tempMod.coinsCoef;
                    }

                    if (tempMod.removesValue) {
                        tempWinData.removesValue += tempMod.removesValue;
                    }
                    if (tempMod.rerollsValue) {
                        tempWinData.rerollsValue += tempMod.rerollsValue;
                    }
                }

                if (tempWinData.coinsValue !== 0 || tempWinData.removesValue !== 0 || tempWinData.rerollsValue !== 0) {
                    totalWin += tempWinData.coinsValue;

                    let valueWinList: ISymbolCoinAnimationVO[] = winDataPerValueMap[tempWinData.coinsValue];
                    if (!valueWinList) {
                        valueWinList = [];
                        winDataPerValueMap[tempWinData.coinsValue] = valueWinList;
                    }

                    valueWinList.push(tempWinData);
                }
            }
        }

        this.globalDispatcher.dispatchEvent(SlotReelsViewSignal.RENDER_SYMBOLS);

        //
        const finalBalance: number = this.gameLogicState.gameLogic.dynamic.coins + totalWin;

        //
        await TimeoutTools.asyncTimeout(100);

        // // START ANIMS
        let soundIndex: number = 0;
        const maxSoundIndex: number = 7;
        for (let singleWinValueListId in winDataPerValueMap) {
            soundIndex++;
            soundIndex = Math.min(soundIndex, maxSoundIndex);

            this.soundsManager.getSound(`Coin${soundIndex}_Sound`).play();

            const singleWinValueAnimPromisses: Promise<void>[] = [];
            const singleWinValueList: ISymbolCoinAnimationVO[] = winDataPerValueMap[singleWinValueListId];
            for (let singleWinValueVO of singleWinValueList) {
                singleWinValueAnimPromisses.push(
                    this.symbolWinAnimationsManager.startWinAnimation(singleWinValueVO)
                );
            }

            await Promise.all(singleWinValueAnimPromisses);
        }

        await TimeoutTools.asyncTimeout(100);

        this.soundsManager.getSound(`CollectAllSound`).play();

        await this.symbolWinAnimationsManager.finishAllAnimations(
            (winData: ISymbolCoinAnimationVO) => {
                this.coinsValueToSetNextFrame = this.coinsValueToSetNextFrame + winData.coinsValue;
                this.removesValueToSetNextFrame = this.removesValueToSetNextFrame + winData.removesValue;
                this.rerollsValueToSetNextFrame = this.rerollsValueToSetNextFrame + winData.rerollsValue;
                // Workaround for too many updates per frame
                setTimeout(
                    () => {
                        if (this.gameLogicState.gameLogic.dynamic.coins !== this.coinsValueToSetNextFrame) {
                            appStorage().change<GameLogicModuleState>()("gameLogic.dynamic.coins", this.coinsValueToSetNextFrame);
                        }
                        if (this.gameLogicState.gameLogic.dynamic.removes !== this.removesValueToSetNextFrame) {
                            appStorage().change<GameLogicModuleState>()("gameLogic.dynamic.removes", this.removesValueToSetNextFrame);
                        }
                        if (this.gameLogicState.gameLogic.dynamic.rerolls !== this.rerollsValueToSetNextFrame) {
                            appStorage().change<GameLogicModuleState>()("gameLogic.dynamic.rerolls", this.rerollsValueToSetNextFrame);
                        }
                    },
                    0
                );
            }
        );

        // Make sure the final balance is exactly what it should be
        appStorage().change<GameLogicModuleState>()("gameLogic.dynamic.coins", finalBalance);

        Analytics.logEvent(AnalyticsEvent.SPIN_WIN, {coins: totalWin});

        this.gameLogicTools.processCounterDataForCurrentNonExtendedSymbols();

        // Delete symbols planned for delete
        for (let singleSymbolToDeletePos of this.positionsToDelete) {
            this.gameReelTools.removeReelSymbol(singleSymbolToDeletePos.x, singleSymbolToDeletePos.y);
        }
        this.globalDispatcher.dispatchEvent(SlotReelsViewSignal.RENDER_SYMBOLS);

        // // Process interactions when some symbols are going out from the reels
        // await this.interactionTools.calculateWinInteractions(
        //     curSymbols,
        //     GameSlotSymbolInteractionTriggerType.ON_REELS_OUT,
        //     (winInteractionsGroup: IGameSymbolWinInteractionVO[]) => {
        //         return this.processWinInteractionsGroup(winInteractionsGroup, GameSlotSymbolViewState.INTERACTION);
        //     }
        // );

        await TimeoutTools.asyncTimeout(250);

        await this.tutorialManager.startStep(GameTutorialStepId.FIRST_WIN);

        this.notifyComplete();
        // alert("Win Anim Complete");
    }


    protected async processWinInteractionsGroup(winInteractionsGroup: IGameSymbolWinInteractionVO[], viewState: string = null): Promise<void> {
        let waitPromises: Promise<void>[] = [];
        let shouldPlaySound: boolean;
        for (let singleWinInteraction of winInteractionsGroup) {
            for (let singleWinAction of singleWinInteraction.winActions) {
                const tempPromise: Promise<void> = this.processWinAction(singleWinAction, viewState);
                waitPromises.push(tempPromise);

                if (singleWinAction.animate) {
                    shouldPlaySound = true;
                }
            }
        }

        if (shouldPlaySound) {
            this.soundsManager.getSound(`SymbolInteractionSound`).play();
        }

        await Promise.all(waitPromises);
    }

    protected async processWinAction(winAction: IGameSymbolWinActionVO, viewState: string = null): Promise<void> {
        if (!this.positionToModificationsMap[winAction.x]) {
            this.positionToModificationsMap[winAction.x] = {};
        }
        if (!this.positionToModificationsMap[winAction.x][winAction.y]) {
            this.positionToModificationsMap[winAction.x][winAction.y] = {
                coinsValue: 0,
                coinsCoef: 1,

                removesValue: 0,
                rerollsValue: 0

                // permanentValueChange: 0,
                // valueCounter: 0
            };
        }

        let tempMod: IWinModifierVO = this.positionToModificationsMap[winAction.x][winAction.y];
        tempMod.coinsCoef *= winAction.coef;
        tempMod.coinsValue += winAction.value;
        tempMod.removesValue += winAction.removesValue;
        tempMod.rerollsValue += winAction.rerollsValue;
        // tempMod.permanentValueChange += winAction.permanentValueChange;
        // tempMod.valueCounter += winAction.valueCounter;

        if (winAction.willBeDestroyed) {
            this.positionsToDelete.push(winAction);
            appStorage().change<GameSlotReelsModuleViewState>()(`slotView.extendedReelSymbolsData.${winAction.x}.${winAction.y}`, { willBeDestroyed: true });
        }

        const symbol: IGameReelSymbolVO = this.reelTools.getReelSymbol(winAction.x, winAction.y) as IGameReelSymbolVO;
        const tempCompnaionData: DeepReadonly<IGameSlotSymbolCompanionVO> = this.gameReelTools.getReelSymbolCompanionData(symbol.tapeIndex, symbol.tapePosition);
        if (!tempCompnaionData) {
            console.warn("WARNING! TemplateWinStateCommand | processWinAction __ Can't find companion data for symbol: ", symbol);
            return;
        }

        if (winAction.rarityModCoefs) {
            for (let singleModCoef of winAction.rarityModCoefs) {
                const oldValue: number = this.gameLogicState.gameLogic.dynamic.curReelsRarityModCoefs[singleModCoef.id] || 1;
                const newValue: number = oldValue * singleModCoef.value;
                appStorage().change<GameLogicModuleState>()(
                    `gameLogic.dynamic.curReelsRarityModCoefs.${singleModCoef.id}`,
                    newValue
                );
            }
        }

        if (winAction.nextSpinRequiredRarities) {
            appStorage().push<GameLogicModuleState>()(
                `gameLogic.dynamic.nextSpinRequiredRarities`,
                ...winAction.nextSpinRequiredRarities
            );
        }

        let companionChangeData: Partial<IGameSlotSymbolCompanionVO> = {
            permanentValueChange: tempCompnaionData.permanentValueChange + winAction.permanentValueChange,
            counterValueToCheck: tempCompnaionData.counterValueToCheck + winAction.counter,
            valueCounterValue: tempCompnaionData.valueCounterValue + winAction.valueCounter,
            counterVisible: this.interactionTools.checkIfSymbolCounterVisible(symbol),
        }

        if (winAction.randomValue || winAction.randomValue === 0) {
            companionChangeData.lastWinActionRandomValue = winAction.randomValue;
        }

        if (winAction.randomNumber || winAction.randomNumber === 0) {
            companionChangeData.lastWinActionRandomNumber = winAction.randomNumber;
        }

        appStorage().change<GameLogicModuleState>()(
            `gameLogic.dynamic.availableSymbolCompanionDataList.${tempCompnaionData.availableSymbolsIndex}`,
            companionChangeData
        );

        let tempCounterValueToShow: number = this.interactionTools.getReelSymbolCompanionCounterValue(tempCompnaionData);
        if (this.interactionTools.checkIfSymbolCounterJustTriggered(symbol)) {
            tempCounterValueToShow = 0;
        }
        appStorage().change<GameLogicModuleState>()(
            `gameLogic.dynamic.availableSymbolCompanionDataList.${tempCompnaionData.availableSymbolsIndex}`,
            {
                counterValueToShow: tempCounterValueToShow,
            }
        );

        if (viewState) {
            if (winAction.animate) {
                // View state can be set in the win action config,
                // or passed as a single parameter for all animations in a list
                let finalViewState: string = winAction.viewState || viewState;
                appStorage().change<GameSlotReelsModuleViewState>()(
                    `slotView.extendedReelSymbolsData.${winAction.x}.${winAction.y}`,
                    {
                        viewState: finalViewState
                    }
                );
            }
        }

        if (winAction.symbolIdsToCreate) {
            for (let singleSymbolIdToCreate of winAction.symbolIdsToCreate) {
                new AddAvailableSymbolCommand(singleSymbolIdToCreate)
                    .execute();
            }
        }

        this.globalDispatcher.dispatchEvent(SlotReelsViewSignal.RENDER_SYMBOLS);

        await getInstance(WaitSymbolViewsToCompleteAnimation, [winAction]).execute();
    }

}

interface IWinModifierVO {
    coinsValue: number;
    coinsCoef: number;

    removesValue: number;
    rerollsValue: number;

    // permanentValueChange: number;

    // valueCounter: number;
}