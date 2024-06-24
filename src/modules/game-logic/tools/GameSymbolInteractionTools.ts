import { appStorage, DeepReadonly } from "@flashist/appframework";
import {ArrayTools, NumberTools} from "@flashist/fcore";
import { getInstance, Point } from "@flashist/flibs";
import { GameSlotSymbolInteractionActionType } from "../../game-slot-reels/data/interactions/GameSlotSymbolInteractionActionType";
import { GameSlotSymbolInteractionTriggerType } from "../../game-slot-reels/data/interactions/GameSlotSymbolInteractionTriggerType";
import { GameSlotSymbolInteractionConditionType } from "../../game-slot-reels/data/interactions/GameSlotSymbolInteractionConditionType";
import { IGameSlotSymbolInteractionConfigVO } from "../../game-slot-reels/data/interactions/IGameSlotSymbolInteractionConfigVO";
import { IGameReelSymbolVO } from "../../game-slot-reels/data/symbols/IGameReelSymbolVO";
import { IGameSlotSymbolCompanionVO } from "../../game-slot-reels/data/symbols/IGameSlotSymbolCompanionVO";
import { IGameSlotSymbolConfigVO } from "../../game-slot-reels/data/symbols/IGameSlotSymbolConfigVO";
import { GameSlotReelSymbolTools } from "../../game-slot-reels/tools/GameSlotReelSymbolTools";
import { SlotReelsModuleState } from "../../slot-reels/data/state/SlotReelsModuleState";
import { AdjacentReelSymbolPositionShifts } from "../../slot-reels/data/symbols/AdjacentReelSymbolPositionShifts";
import { IReelSymbolPositionVO } from "../../slot-reels/data/symbols/IReelSymbolPositionVO";
import { IReelSymbolVO } from "../../slot-reels/data/symbols/IReelSymbolVO";
import { SlotReelTools } from "../../slot-reels/tools/SlotReelTools";
import { IGameSymbolWinActionVO } from "../data/interaction/IGameSymbolWinActionVO";
import { IGameSymbolWinInteractionVO } from "../data/interaction/IGameSymbolWinInteractionVO";
import { GameLogicTools } from "./GameLogicTools";
import { IFindSymbolsOnReelsConfigVO } from "./IFindSymbolsOnReelsConfigVO";
import {RarityId} from "../data/rarity/RarityId";
import {GameSymbolId} from "../../game-slot-reels/data/symbols/GameSymbolId";
import {SlotReelsModuleViewState} from "../../slot-reels/data/state/SlotReelsModuleViewState";

export class GameSymbolInteractionTools {
    protected adjacentActionTypes: GameSlotSymbolInteractionActionType[] = [GameSlotSymbolInteractionActionType.TARGET];

    protected interactionTypesByPriority: GameSlotSymbolInteractionConditionType[] = [
        GameSlotSymbolInteractionConditionType.NONE,
        GameSlotSymbolInteractionConditionType.RANDOM,
        GameSlotSymbolInteractionConditionType.ACTIVE_COUNTER,
        GameSlotSymbolInteractionConditionType.COUNTER,
        GameSlotSymbolInteractionConditionType.POSITIONS,
        GameSlotSymbolInteractionConditionType.SYMBOLS_ON_REELS,
        GameSlotSymbolInteractionConditionType.ADJACENT,
        GameSlotSymbolInteractionConditionType.DIRECTION_SYMBOLS
    ];

    protected directionShifts: Point[] = [
        new Point(1, 0),
        new Point(1, 1),
        new Point(0, 1),
        new Point(-1, 1),
        new Point(-1, 0),
        new Point(-1, -1),
        new Point(0, -1),
        new Point(1, -1)
    ];

    protected reelTools: SlotReelTools;
    protected gameSymbolTools: GameSlotReelSymbolTools;
    protected gameLogicTools: GameLogicTools;
    protected reelsState: DeepReadonly<SlotReelsModuleState>;

    protected interactionMethodToTypeMap: Record<string, typeof this.processPositionsInteraction> = {};

    constructor() {
        this.reelTools = getInstance(SlotReelTools);
        this.gameSymbolTools = getInstance(GameSlotReelSymbolTools);
        this.gameLogicTools = getInstance(GameLogicTools);
        this.reelsState = appStorage().getState<SlotReelsModuleState>();

        this.interactionMethodToTypeMap[GameSlotSymbolInteractionConditionType.NONE] = this.processNoneInteraction.bind(this);
        this.interactionMethodToTypeMap[GameSlotSymbolInteractionConditionType.POSITIONS] = this.processPositionsInteraction.bind(this);
        this.interactionMethodToTypeMap[GameSlotSymbolInteractionConditionType.ACTIVE_COUNTER] = this.processActiveCounterInteraction.bind(this);
        this.interactionMethodToTypeMap[GameSlotSymbolInteractionConditionType.COUNTER] = this.processCounterInteraction.bind(this);
        this.interactionMethodToTypeMap[GameSlotSymbolInteractionConditionType.ADJACENT] = this.processAdjacentInteraction.bind(this);
        this.interactionMethodToTypeMap[GameSlotSymbolInteractionConditionType.SYMBOLS_ON_REELS] = this.processSymbolsOnReelsInteraction.bind(this);
        this.interactionMethodToTypeMap[GameSlotSymbolInteractionConditionType.DIRECTION_SYMBOLS] = this.processDirectionSymbolsInteraction.bind(this);
        this.interactionMethodToTypeMap[GameSlotSymbolInteractionConditionType.RANDOM] = this.processRandomInteraction.bind(this);
    }

    public async calculateWinInteractions(
        reelSymbols: IGameReelSymbolVO[][],
        triggerType: GameSlotSymbolInteractionTriggerType,
        winInteractionsGroupCallback: (winInteractionsGroup: IGameSymbolWinInteractionVO[]) => Promise<void>
    ): Promise<IGameSymbolWinInteractionVO[]> {

        const result: IGameSymbolWinInteractionVO[] = [];

        // const allSymbolWithInteractions: ISymbolWithInteractionVO[] = [];
        const allSymbolWithInteractionsByType: { [interactionType: string]: ISymbolWithInteractionVO[] } = {};
        for (let singleReelSymbols of reelSymbols) {
            if (!singleReelSymbols) {
                continue;
            }

            for (let singleSymbol of singleReelSymbols) {
                if (!singleSymbol) {
                    continue;
                }

                const symbolConfig: IGameSlotSymbolConfigVO = this.reelTools.getSymbolConfig(singleSymbol.id) as IGameSlotSymbolConfigVO;
                if (symbolConfig.interactions) {
                    for (let singleInteractionConfig of symbolConfig.interactions) {
                        if (!allSymbolWithInteractionsByType[singleInteractionConfig.conditionType]) {
                            allSymbolWithInteractionsByType[singleInteractionConfig.conditionType] = [];
                        }

                        allSymbolWithInteractionsByType[singleInteractionConfig.conditionType].push(
                            {
                                symbol: singleSymbol,
                                interaction: singleInteractionConfig
                            }
                        );
                    }
                }
            }
        }

        const allInteractionsSorted: ISymbolWithInteractionVO[] = [];
        // Sort interactions by types
        for (let singleInteractionType of this.interactionTypesByPriority) {
            let tempInteractions: ISymbolWithInteractionVO[] = allSymbolWithInteractionsByType[singleInteractionType];
            if (tempInteractions) {
                allInteractionsSorted.push(...tempInteractions);
            }
        }

        allInteractionsSorted.sort(
            (item1: ISymbolWithInteractionVO, item2: ISymbolWithInteractionVO): number => {
                let result: number = 0;

                if (item1.interaction.priority !== item2.interaction.priority) {
                    let priority1: number = item1.interaction.priority || 0;
                    let priority2: number = item2.interaction.priority || 0;

                    result = priority2 - priority1;
                }

                return result;
            }
        );

        for (let singleSymbolWithInteraction of allInteractionsSorted) {
            const singleSymbol: IGameReelSymbolVO = singleSymbolWithInteraction.symbol;
            const singleInteractionConfig: IGameSlotSymbolInteractionConfigVO = singleSymbolWithInteraction.interaction;

            if (singleInteractionConfig.triggerType === triggerType) {
                const interactionMethod = this.interactionMethodToTypeMap[singleInteractionConfig.conditionType];
                if (interactionMethod) {
                    const winInteractions: IGameSymbolWinInteractionVO[] = interactionMethod(
                        singleSymbol,
                        singleInteractionConfig
                    );

                    if (winInteractions) {
                        result.push(...winInteractions);

                        if (winInteractionsGroupCallback) {

                            await winInteractionsGroupCallback(winInteractions);
                        }
                    }

                } else {
                    console.warn("WARNING! Can't find interaction method for Interaction Type: ", singleInteractionConfig.conditionType);
                }

            }
        }

        return result;
    }

    protected calculateWinInteractionData(
        symbol: IReelSymbolVO,
        targetSymbols: IGameReelSymbolVO[],
        interactionConfig: IGameSlotSymbolInteractionConfigVO,
        triggerdedTimes: number,
        actionTypes?: GameSlotSymbolInteractionActionType[],
        ignoreActionTypes?: GameSlotSymbolInteractionActionType[],
    ): IGameSymbolWinInteractionVO {

        let result: IGameSymbolWinInteractionVO = {
            winActions: []
        };

        const symbolCompanionData: IGameSlotSymbolCompanionVO = this.gameSymbolTools.getReelSymbolCompanionData(symbol.tapeIndex, symbol.tapePosition);

        for (let triggerIndex: number = 0; triggerIndex < triggerdedTimes; triggerIndex++) {
            for (let singleAction of interactionConfig.actions) {

                let shouldBeProcessed: boolean = true
                if (actionTypes && actionTypes.indexOf(singleAction.type) === -1) {
                    shouldBeProcessed = false;
                }
                if (ignoreActionTypes && ignoreActionTypes.indexOf(singleAction.type) !== -1) {
                    shouldBeProcessed = false;
                }

                if (shouldBeProcessed) {
                    const tempWinAction: IGameSymbolWinActionVO = {
                        x: symbol.position.x,
                        y: symbol.position.y,
                        animate: true,
                        viewState: null,
                        value: 0,
                        coef: 1,
                        permanentValueChange: 0,
                        removesValue: 0,
                        rerollsValue: 0,
                        willBeDestroyed: false,
                        symbolIdsToCreate: [],
                        counter: 0,
                        valueCounter: 0,
                        randomValue: null,
                        randomNumber: null,
                        rarityModCoefs: [],
                        nextSpinRequiredRarities: []
                    };

                    if (singleAction.value) {
                        tempWinAction.value += singleAction.value;
                    }
                    if (singleAction.minRandomValue || singleAction.maxRandomValue) {
                        const randValue: number = NumberTools.getRandomInt(singleAction.minRandomValue, singleAction.maxRandomValue);
                        tempWinAction.value += randValue;

                        tempWinAction.randomValue = randValue;
                    }

                    if (singleAction.removesValue) {
                        tempWinAction.removesValue += singleAction.removesValue;
                    }
                    if (singleAction.rerollsValue) {
                        tempWinAction.rerollsValue += singleAction.rerollsValue;
                    }

                    if (singleAction.nextSpinRequiredRarities) {
                        tempWinAction.nextSpinRequiredRarities.push(...singleAction.nextSpinRequiredRarities);
                    }

                    if (singleAction.minRandomNumber || singleAction.maxRandomNumber) {
                        let randNumber: number = NumberTools.getRandomFloat(singleAction.minRandomNumber, singleAction.maxRandomNumber);
                        // randNumber = 1 / 8;
                        // randNumber = 2 / 8;
                        // randNumber = 3 / 8;
                        // randNumber = 4 / 8;
                        // randNumber = 5 / 8;
                        // randNumber = 0.06938470788250362;
                        // randNumber = 0.5989808541565915;
                        // randNumber = 0.9791789412508753;

                        tempWinAction.randomNumber = randNumber;
                    }

                    if (singleAction.coef || singleAction.coef === 0) {
                        tempWinAction.coef *= singleAction.coef;
                    }
                    if (singleAction.targetValueCoef || singleAction.targetValueCoef === 0) {
                        if (targetSymbols) {
                            const singleTargetSymbol: IGameReelSymbolVO = targetSymbols[triggerIndex];
                            const targetValue: number = this.gameLogicTools.getReelSymbolTotalValue(singleTargetSymbol);
                            tempWinAction.value += targetValue * singleAction.targetValueCoef;
                        }
                    }

                    if (singleAction.permanentValueChange) {
                        tempWinAction.permanentValueChange += singleAction.permanentValueChange;
                    }

                    tempWinAction.willBeDestroyed = singleAction.destroying;

                    if (singleAction.symbolIdsToCreate) {
                        tempWinAction.symbolIdsToCreate.push(...singleAction.symbolIdsToCreate);
                    }

                    if (singleAction.randomSymbolIds) {
                        for (let symbolIndex: number = 0; symbolIndex < singleAction.randomSymbolIdsCount; symbolIndex++) {
                            let symbolIdsToChooseFrom: GameSymbolId[] = singleAction.randomSymbolIds.concat();
                            if (singleAction.randomSymbolsUseRarity) {
                                let randRarity: RarityId = this.gameLogicTools.getRandomRarityForCurrentState();
                                let symbolConfigsToChooseFrom: IGameSlotSymbolConfigVO[] = this.gameLogicTools.getSymbolConfigsByIds(symbolIdsToChooseFrom);
                                symbolConfigsToChooseFrom = symbolConfigsToChooseFrom.filter(
                                    (item: IGameSlotSymbolConfigVO) => {
                                        return item.rarity === randRarity;
                                    }
                                );
                                symbolIdsToChooseFrom = symbolConfigsToChooseFrom.map(
                                    (item: IGameSlotSymbolConfigVO) => {
                                        return item.id;
                                    }
                                );
                            }

                            let randSymbolId: GameSymbolId = ArrayTools.getRandomItem(symbolIdsToChooseFrom);
                            tempWinAction.symbolIdsToCreate.push(randSymbolId);
                        }
                    }

                    if (singleAction.counter) {
                        tempWinAction.counter += singleAction.counter;
                    }

                    if (singleAction.valueCounter) {
                        tempWinAction.valueCounter += singleAction.valueCounter;
                    }
                    if (singleAction.useValueCounter) {
                        tempWinAction.value += symbolCompanionData.valueCounterValue;
                    }

                    if (singleAction.rariyModCoefs) {
                        tempWinAction.rarityModCoefs.push(...singleAction.rariyModCoefs);
                    }

                    if (singleAction.ignoreAnim) {
                        tempWinAction.animate = false;
                    }

                    if (singleAction.viewState) {
                        tempWinAction.viewState = singleAction.viewState;
                    }

                    result.winActions.push(tempWinAction);
                }
            }
        }

        return result;
    }

    protected processFindSymbolsInteraction(symbol: IReelSymbolVO, interactionConfig: IGameSlotSymbolInteractionConfigVO, findConfig: IFindSymbolsOnReelsConfigVO): IGameSymbolWinInteractionVO[] {
        let result: IGameSymbolWinInteractionVO[] = [];

        let foundSymbolsCount: number = 0;

        const foundSymbols: IGameReelSymbolVO[] = this.gameLogicTools.findSymbolsOnReels(findConfig);
        for (let singleFoundSymbol of foundSymbols) {
            foundSymbolsCount++;

            const checkingWinInteractionData: IGameSymbolWinInteractionVO = this.calculateWinInteractionData(
                singleFoundSymbol,
                null,
                interactionConfig,
                1,
                this.adjacentActionTypes
            );
            result.push(checkingWinInteractionData);
        }

        if (interactionConfig.minSymbolsCount) {
            if (foundSymbolsCount < interactionConfig.minSymbolsCount) {
                foundSymbolsCount = 0;
            }
        }

        if (interactionConfig.maxRepeatCount) {
            foundSymbolsCount = Math.min(foundSymbolsCount, interactionConfig.maxRepeatCount);
        }

        let triggerTimes: number = 0;
        if (interactionConfig.lessThanOrEqualSymbolsCount || interactionConfig.lessThanOrEqualSymbolsCount === 0) {
            if (foundSymbolsCount <= interactionConfig.lessThanOrEqualSymbolsCount) {
                triggerTimes = 1;
            }

        } else {
            triggerTimes = foundSymbolsCount;
        }

        if (triggerTimes > 0) {
            const adjacentWinInteractionData: IGameSymbolWinInteractionVO = this.calculateWinInteractionData(
                symbol,
                foundSymbols,
                interactionConfig,
                triggerTimes,
                null,
                this.adjacentActionTypes
            );
            result.push(adjacentWinInteractionData);
        }

        return result;
    }

    //

    protected processPositionsInteraction(symbol: IReelSymbolVO, interactionConfig: IGameSlotSymbolInteractionConfigVO): IGameSymbolWinInteractionVO[] | null {
        const mainReelX: number = symbol.position.x;
        const mainReelY: number = symbol.position.y - this.reelsState.slot.static.additionalVisibleSymbolsCount;

        let isInteractionActive: boolean;
        for (let singlePosition of interactionConfig.positions) {
            if (singlePosition.x === mainReelX && singlePosition.y === mainReelY) {
                isInteractionActive = true;
                break;
            }
        }

        let result: IGameSymbolWinInteractionVO[] = [];
        if (isInteractionActive) {
            let winInteraction: IGameSymbolWinInteractionVO = this.calculateWinInteractionData(
                symbol,
                null,
                interactionConfig,
                1
            );
            result.push(winInteraction);
        }

        return result;
    }

    protected processCounterInteraction(symbol: IGameReelSymbolVO, interactionConfig: IGameSlotSymbolInteractionConfigVO): IGameSymbolWinInteractionVO[] | null {
        let isInteractionActive: boolean;
        const symbolCompanionData: IGameSlotSymbolCompanionVO = this.gameSymbolTools.getReelSymbolCompanionData(symbol.tapeIndex, symbol.tapePosition);

        let triggeredCount: number = 0;
        if (symbolCompanionData.counterValueToCheck > 0) {
            if (this.checkIfSymbolCounterActive(symbol)) {

                const prevTriggeredCount: number = this.getSymbolPrevCounterTriggeredTimes(symbol);
                if (!interactionConfig.maxRepeatCount || prevTriggeredCount < interactionConfig.maxRepeatCount) {

                    triggeredCount = this.getSymbolCurrentCounterTriggeredTimes(symbol);
                    if (interactionConfig.maxRepeatCount) {
                        triggeredCount = Math.min(triggeredCount, interactionConfig.maxRepeatCount);
                    }

                    if (triggeredCount > 0) {
                        isInteractionActive = true;
                    }

                }
            }
        }

        let result: IGameSymbolWinInteractionVO[] = [];
        if (isInteractionActive) {
            let winInteraction: IGameSymbolWinInteractionVO = this.calculateWinInteractionData(symbol, null, interactionConfig, triggeredCount);
            result.push(winInteraction);
        }

        return result;
    }

    protected processAdjacentInteraction(symbol: IReelSymbolVO, interactionConfig: IGameSlotSymbolInteractionConfigVO): IGameSymbolWinInteractionVO[] | null {

        const findConfig: IFindSymbolsOnReelsConfigVO = {
            symbolIds: interactionConfig.symbolIds,
            ignoreSymbolIds: interactionConfig.ignoreSymbolIds,
            symbolTags: interactionConfig.symbolTags,
            randomValue: interactionConfig.targetRandomToTrigger,
            checkPositions: []
        };

        if (this.interactionRandomGuard(interactionConfig)) {
            const minCheckingY: number = this.reelsState.slot.static.additionalVisibleSymbolsCount;
            const maxCheckingY: number = this.reelsState.slot.static.additionalVisibleSymbolsCount + this.reelsState.slot.static.rowsCount;
            //
            let adjacentPosShifts: Point[] = AdjacentReelSymbolPositionShifts.concat();
            if (interactionConfig.findRandomAdjacent) {
                ArrayTools.randomizeArray(adjacentPosShifts);
            }
            let adjacentPosCount: number = AdjacentReelSymbolPositionShifts.length;
            //
            for (let adjacentPosIndex: number = 0; adjacentPosIndex < adjacentPosCount; adjacentPosIndex++) {
                let singlePosShift: { x: number, y: number } = AdjacentReelSymbolPositionShifts[adjacentPosIndex];

                const tempAdjacentPos: IReelSymbolPositionVO = {
                    x: symbol.position.x + singlePosShift.x,
                    y: symbol.position.y + singlePosShift.y
                };

                if ((0 <= tempAdjacentPos.x && tempAdjacentPos.x < this.reelsState.slot.static.colsCount) &&
                    (minCheckingY <= tempAdjacentPos.y && tempAdjacentPos.y < maxCheckingY)) {

                    let includeSymbol: boolean = true;
                    if (interactionConfig.ignoreSymbolIds) {
                        const tempSymbol: IReelSymbolVO = appStorage().getState<SlotReelsModuleViewState>().slotView.extendedReelSymbolsData[tempAdjacentPos.x]?.[tempAdjacentPos.y];
                        if (tempSymbol) {
                            if (interactionConfig.ignoreSymbolIds.indexOf(tempSymbol.id) !== -1) {
                                includeSymbol = false;
                            }
                        }
                    }

                    if (includeSymbol) {
                        findConfig.checkPositions.push(tempAdjacentPos);
                    }
                }

                if (interactionConfig.maxSymbolsCount) {
                    if (findConfig.checkPositions.length >= interactionConfig.maxSymbolsCount) {
                        break;
                    }
                }
            }
        }

        const result: IGameSymbolWinInteractionVO[] = this.processFindSymbolsInteraction(symbol, interactionConfig, findConfig);
        return result;
    }

    protected processSymbolsOnReelsInteraction(symbol: IGameReelSymbolVO, interactionConfig: IGameSlotSymbolInteractionConfigVO): IGameSymbolWinInteractionVO[] | null {
        const findConfig: IFindSymbolsOnReelsConfigVO = {
            symbolIds: interactionConfig.symbolIds,
            symbolTags: interactionConfig.symbolTags,
            randomValue: interactionConfig.targetRandomToTrigger
        };
        if (!interactionConfig.countSelf) {
            findConfig.ignorePositions = [symbol.position];
        }

        if (interactionConfig.shouldBeSameX || interactionConfig.shouldBeSameY) {
            findConfig.checkPositions = [];
            if (interactionConfig.shouldBeSameX) {
                const maxRowIndex: number = this.reelsState.slot.static.additionalVisibleSymbolsCount + this.reelsState.slot.static.colsCount;
                for (let rowIndex: number = this.reelsState.slot.static.additionalVisibleSymbolsCount; rowIndex < maxRowIndex; rowIndex++) {
                    findConfig.checkPositions.push({ x: symbol.position.x, y: rowIndex });
                }
            }

            if (interactionConfig.shouldBeSameY) {
                for (let reelIndex: number = 0; reelIndex < this.reelsState.slot.static.colsCount; reelIndex++) {
                    findConfig.checkPositions.push({ x: reelIndex, y: symbol.position.y });
                }
            }
        }

        const result: IGameSymbolWinInteractionVO[] = this.processFindSymbolsInteraction(symbol, interactionConfig, findConfig);
        return result;
    }

    protected processDirectionSymbolsInteraction(symbol: IGameReelSymbolVO, interactionConfig: IGameSlotSymbolInteractionConfigVO): IGameSymbolWinInteractionVO[] | null {
        const findConfig: IFindSymbolsOnReelsConfigVO = {
            symbolIds: interactionConfig.symbolIds,
            symbolTags: interactionConfig.symbolTags,
            randomValue: interactionConfig.targetRandomToTrigger,
            checkPositions: []
        }

        const symbolCompanionData: IGameSlotSymbolCompanionVO = this.gameSymbolTools.getReelSymbolCompanionData(symbol.tapeIndex, symbol.tapePosition);
        //

        let randDirectionIndex: number;
        if (interactionConfig.useLastRandomNumber) {
            randDirectionIndex = Math.floor(symbolCompanionData.lastWinActionRandomNumber * this.directionShifts.length);
        } else {
            randDirectionIndex = NumberTools.getRandomInt(0, this.directionShifts.length);
        }
        const randShift: Point = this.directionShifts[randDirectionIndex];
        //
        const minCheckingY: number = this.reelsState.slot.static.additionalVisibleSymbolsCount
        const maxCheckingY: number = this.reelsState.slot.static.additionalVisibleSymbolsCount + this.reelsState.slot.static.rowsCount
        //
        let tempPos: Point = new Point(symbol.position.x, symbol.position.y);
        let doSearch: boolean = true;
        while (doSearch) {
            tempPos.x += randShift.x;
            tempPos.y += randShift.y;


            if ((0 <= tempPos.x && tempPos.x < this.reelsState.slot.static.colsCount) &&
                (minCheckingY <= tempPos.y && tempPos.y < maxCheckingY)) {

                findConfig.checkPositions.push(tempPos.clone());

            } else {
                doSearch = false;
            }
        }

        const result: IGameSymbolWinInteractionVO[] = this.processFindSymbolsInteraction(symbol, interactionConfig, findConfig);
        return result;
    }

    protected processNoneInteraction(symbol: IReelSymbolVO, interactionConfig: IGameSlotSymbolInteractionConfigVO): IGameSymbolWinInteractionVO[] | null {
        let winInteraction: IGameSymbolWinInteractionVO = this.calculateWinInteractionData(symbol, null, interactionConfig, 1);
        const result: IGameSymbolWinInteractionVO[] = [winInteraction];
        return result;
    }

    protected processRandomInteraction(symbol: IReelSymbolVO, interactionConfig: IGameSlotSymbolInteractionConfigVO): IGameSymbolWinInteractionVO[] | null {
        let result: IGameSymbolWinInteractionVO[] = [];

        if (this.interactionRandomGuard(interactionConfig)) {
            let winInteraction: IGameSymbolWinInteractionVO = this.calculateWinInteractionData(symbol, null, interactionConfig, 1);
            result.push(winInteraction);
        }

        return result;
    }

    protected interactionRandomGuard(interactionConfig: IGameSlotSymbolInteractionConfigVO): boolean {
        let result: boolean = false;

        if (interactionConfig.random) {
            const tempRand: number = Math.random();
            if (tempRand <= interactionConfig.random) {
                result = true;
            }
        } else {
            result = true;
        }

        return result;
    }

    // - - - - -
    // COUNTERS
    // - - - - -

    public checkIfSymbolHasCounter(symbolId: string): boolean {
        const config: IGameSlotSymbolConfigVO = this.reelTools.getSymbolConfig(symbolId) as IGameSlotSymbolConfigVO;
        return config.counterVisible;
    }

    protected processActiveCounterInteraction(symbol: IGameReelSymbolVO, interactionConfig: IGameSlotSymbolInteractionConfigVO): IGameSymbolWinInteractionVO[] | null {

        const symbolCompanionData: IGameSlotSymbolCompanionVO = this.gameSymbolTools.getReelSymbolCompanionData(symbol.tapeIndex, symbol.tapePosition);

        let isIneteractionActive: boolean = false;
        if (this.checkIfSymbolCounterActive(symbol)) {
            isIneteractionActive = true;
        }

        const result: IGameSymbolWinInteractionVO[] = [];

        if (isIneteractionActive) {
            let winInteraction: IGameSymbolWinInteractionVO = this.calculateWinInteractionData(symbol, null, interactionConfig, 1);
            result.push(winInteraction);
        }

        return result;
    }

    public getSymbolConfigFirstCounterInteraction(symbolId: string): IGameSlotSymbolInteractionConfigVO {
        let result: IGameSlotSymbolInteractionConfigVO;

        const config: IGameSlotSymbolConfigVO = this.reelTools.getSymbolConfig(symbolId) as IGameSlotSymbolConfigVO;
        if (config.interactions) {
            for (let singleInteraction of config.interactions) {
                if (singleInteraction.conditionType === GameSlotSymbolInteractionConditionType.COUNTER) {
                    result = singleInteraction;
                    break;
                }
            }
        }

        return result;
    }

    public getReelSymbolFullCounterTimes(symbol: IGameReelSymbolVO): number {
        let result: number = 0;

        if (this.checkIfSymbolHasCounter(symbol.id)) {
            const symbolCompanionData: IGameSlotSymbolCompanionVO = this.gameSymbolTools.getReelSymbolCompanionData(symbol.tapeIndex, symbol.tapePosition);
            result = Math.floor(symbolCompanionData.counterValueToCheck / symbolCompanionData.counterValueToTrigger);
        }

        return result;
    }

    public getSymbolPrevCounterTriggeredTimes(symbol: IGameReelSymbolVO): number {
        let result: number = 0;

        if (this.checkIfSymbolHasCounter(symbol.id)) {
            const symbolCompanionData: IGameSlotSymbolCompanionVO = this.gameSymbolTools.getReelSymbolCompanionData(symbol.tapeIndex, symbol.tapePosition);
            result = Math.floor(symbolCompanionData.counterPrevProcessedValue / symbolCompanionData.counterValueToTrigger);
        }

        return result;
    }

    public getSymbolCurrentCounterTriggeredTimes(symbol: IGameReelSymbolVO): number {
        let result: number = 0;

        if (this.checkIfSymbolHasCounter(symbol.id)) {
            const symbolCompanionData: IGameSlotSymbolCompanionVO = this.gameSymbolTools.getReelSymbolCompanionData(symbol.tapeIndex, symbol.tapePosition);
            result = Math.floor(symbolCompanionData.counterValueToCheck / symbolCompanionData.counterValueToTrigger) - Math.floor(symbolCompanionData.counterPrevProcessedValue / symbolCompanionData.counterValueToTrigger);
        }

        return result;
    }

    public checkIfSymbolCounterJustTriggered(symbol: IGameReelSymbolVO): boolean {
        let result: boolean = false;

        if (this.checkIfSymbolHasCounter(symbol.id)) {
            // const symbolCompanionData: IGameSlotSymbolCompanionVO = this.gameSymbolTools.getReelSymbolCompanionData(symbol.tapeIndex, symbol.tapePosition);
            const curTriggerTimes: number = this.getSymbolCurrentCounterTriggeredTimes(symbol);
            if (curTriggerTimes > 0) {
                result = true;
            }
        }

        return result;
    }

    public checkIfSymbolCounterVisible(symbol: IGameReelSymbolVO): boolean {
        let result: boolean = false;

        if (this.checkIfSymbolHasCounter(symbol.id)) {
            const interactionConfig: IGameSlotSymbolInteractionConfigVO = this.getSymbolConfigFirstCounterInteraction(symbol.id);
            if (interactionConfig.maxRepeatCount) {
                const counterFullTimes: number = this.getReelSymbolFullCounterTimes(symbol);
                if (counterFullTimes < interactionConfig.maxRepeatCount) {
                    result = true;
                }

            } else {
                result = true;
            }
        }

        return result;
    }

    public checkIfSymbolCounterActive(symbol: IGameReelSymbolVO): boolean {
        let result: boolean = false;

        if (this.checkIfSymbolHasCounter(symbol.id)) {
            const interactionConfig: IGameSlotSymbolInteractionConfigVO = this.getSymbolConfigFirstCounterInteraction(symbol.id);
            if (interactionConfig.maxRepeatCount) {
                const counterFullTimes: number = this.getReelSymbolFullCounterTimes(symbol);

                if (counterFullTimes < interactionConfig.maxRepeatCount) {
                    result = true;

                } else {
                    const prevTriggerTimes: number = this.getSymbolPrevCounterTriggeredTimes(symbol);
                    if (prevTriggerTimes < interactionConfig.maxRepeatCount) {
                        if (this.checkIfSymbolCounterJustTriggered(symbol)) {
                            result = true;
                        }
                    }
                }

            } else {
                result = true;
            }
        }

        return result;
    }

    //

    public getReelSymbolCompanionCounterValue(symbolCompanion: IGameSlotSymbolCompanionVO): number {
        let result: number = -1;

        if (this.checkIfSymbolHasCounter(symbolCompanion.id)) {
            const config: IGameSlotSymbolConfigVO = this.reelTools.getSymbolConfig(symbolCompanion.id) as IGameSlotSymbolConfigVO;
            if (config.counter) {
                result = config.counter;
                if (symbolCompanion.timesOnReels > 0) {
                    result -= (symbolCompanion.counterValueToCheck % config.counter);
                }
            }
        }

        return result;
    }

    public checkIfSymbolHasValueCounter(symbolId: string): boolean {
        const config: IGameSlotSymbolConfigVO = this.reelTools.getSymbolConfig(symbolId) as IGameSlotSymbolConfigVO;
        return config.valueCounterVisible;
    }

    public checkIfSymbolHasValueChangeCounter(symbolId: string): boolean {
        const config: IGameSlotSymbolConfigVO = this.reelTools.getSymbolConfig(symbolId) as IGameSlotSymbolConfigVO;
        return config.valueChangeCounterVisible;
    }
}

interface ISymbolWithInteractionVO {
    symbol: IGameReelSymbolVO,
    interaction: IGameSlotSymbolInteractionConfigVO
}