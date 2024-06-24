import {appStorage} from "@flashist/appframework/state/AppStateModule";
import {DeepReadonly} from "@flashist/appframework/state/data/DeepReadableTypings";
import {getInstance} from "@flashist/flibs";
import {IGameSlotSymbolConfigVO} from "../../game-slot-reels/data/symbols/IGameSlotSymbolConfigVO";
import {GameSlotReelsModuleState} from "../../game-slot-reels/data/state/GameSlotReelsModuleState";
import {IGameSlotSymbolCompanionVO} from "../../game-slot-reels/data/symbols/IGameSlotSymbolCompanionVO";
import {GameSlotReelSymbolTools} from "../../game-slot-reels/tools/GameSlotReelSymbolTools";
import {SlotReelsModuleState} from "../../slot-reels/data/state/SlotReelsModuleState";
import {IReelSymbolVO} from "../../slot-reels/data/symbols/IReelSymbolVO";
import {SlotReelTools} from "../../slot-reels/tools/SlotReelTools";
import {IRarityConfigVO} from "../data/rarity/IRarityConfigVO";
import {RarityId} from "../data/rarity/RarityId";
import {GameLogicModuleState} from "../data/state/GameLogicModuleState";
import {IFloorConfigVO} from "../data/state/IFloorConfigVO";
import {IMissionConfigVO} from "../data/state/IMissionConfigVO";
import {IFindSymbolsOnReelsConfigVO} from "./IFindSymbolsOnReelsConfigVO";
import {IGameReelSymbolVO} from "../../game-slot-reels/data/symbols/IGameReelSymbolVO";
import {ObjectTools} from "@flashist/fcore";
import {IRarityValueVO} from "../data/rarity/IRarityValueVO";

export class GameLogicTools {

    protected gameLogicState = appStorage().getState<GameLogicModuleState>();
    protected reelsState = appStorage().getState<SlotReelsModuleState>();
    protected gameReelsState = appStorage().getState<GameSlotReelsModuleState>();

    public getActiveFloor(): DeepReadonly<IFloorConfigVO> {
        return this.gameLogicState.gameLogic.static.floors[this.gameLogicState.gameLogic.dynamic.floorId];
    }

    public getActiveFloorActiveMission(): IMissionConfigVO {
        const result: IMissionConfigVO = ObjectTools.clone(this.gameLogicState.gameLogic.static.missions.default);
        ObjectTools.copyProps(
            result,
            this.gameLogicState.gameLogic.static.missions[this.gameLogicState.gameLogic.dynamic.missionId]
        );

        return result;
    }

    public getActiveFloorNextMissionId(): string {
        let result: string;

        const curFloor = this.getActiveFloor();
        const curMissionIndex: number = curFloor.missions.indexOf(this.gameLogicState.gameLogic.dynamic.missionId);
        if (curMissionIndex !== -1) {
            const nextMissionIndex: number = curMissionIndex + 1;
            result = curFloor.missions[nextMissionIndex];
        }

        return result;
    }

    public getIfLastMission(): boolean {
        const nextMissionId: string = this.getActiveFloorNextMissionId();

        let result: boolean = false;
        if (!nextMissionId) {
            result = true;
        }

        return result;
    }

    public generateNewEndlessMission(): void {
        const currentActiveMission: IMissionConfigVO = this.getActiveFloorActiveMission();

        const curFloor: DeepReadonly<IFloorConfigVO> = this.getActiveFloor();
        const newMissionDayNumber: number = curFloor.missions.length + 1;
        const newMissionId: string = `day${newMissionDayNumber}`;

        const newMissionConfig: IMissionConfigVO = {
            id: newMissionId,

            texts: {
            },

            rarity: ObjectTools.clone(currentActiveMission.rarity),

            day: currentActiveMission.day + 1,
            coins: Math.ceil(currentActiveMission.coins * 1.25),
            spins: currentActiveMission.spins,
        };
        if (currentActiveMission.startBonus) {
            newMissionConfig.startBonus = ObjectTools.clone(currentActiveMission.startBonus);
        }

        // this.gameLogicState.gameLogic.static.missions
        appStorage().change<GameLogicModuleState>()(
            "gameLogic.static.missions",
            {
                [newMissionId]: newMissionConfig
            }
        );

        const newMissionIds: string[] = [...curFloor.missions, newMissionId];
        appStorage().change<GameLogicModuleState>()(
            `gameLogic.static.floors.${this.gameLogicState.gameLogic.dynamic.floorId}`,
            {
                missions: newMissionIds
            }
        );
    }

    public getSpinsLeftForActiveMission(): number {
        const activeMission: IMissionConfigVO = this.getActiveFloorActiveMission();

        let result: number = activeMission.spins - this.gameLogicState.gameLogic.dynamic.missionSpins;
        if (result < 0) {
            result = 0;
        }
        return result;
    }

    public getCoinsLeftForActiveMission(): number {
        const activeMission: IMissionConfigVO = this.getActiveFloorActiveMission();

        let result: number = activeMission.coins - this.gameLogicState.gameLogic.dynamic.coins;
        if (result < 0) {
            result = 0;
        }
        return result;
    }

    public getRarityConfig(rarityId: string): IRarityConfigVO {
        return this.gameLogicState.gameLogic.static.rarities[rarityId];
    }

    public getFinalRarity(): IRarityValueVO[] {
        let result: IRarityValueVO[] = [];

        for (let singleBaseRarityId in this.gameLogicState.gameLogic.dynamic.baseRarity) {
            const singleBaseRarityValue: number = this.gameLogicState.gameLogic.dynamic.baseRarity[singleBaseRarityId]
            let singleRarityModCoef: number = this.gameLogicState.gameLogic.dynamic.curReelsRarityModCoefs[singleBaseRarityId];
            if (!singleRarityModCoef && singleRarityModCoef !== 0) {
                singleRarityModCoef = 1;
            }

            let singleRarityValue: IRarityValueVO = {
                id: singleBaseRarityId as RarityId,
                value: singleBaseRarityValue * singleRarityModCoef
            };

            result.push(singleRarityValue);
        }

        return result;
    }

    public getTotalRaritiesWeight(availableRarities?: string[]): number {

        let totalRaritiesWeight: number = 0;

        const finalRarity: IRarityValueVO[] = this.getFinalRarity();
        for (let singleRarity of finalRarity) {
            if (availableRarities) {
                if (availableRarities.indexOf(singleRarity.id) === -1) {
                    // Skip rarity if it's not in the list of allowed rarities
                    continue;
                }
            }

            totalRaritiesWeight += singleRarity.value;
        }

        return totalRaritiesWeight;
    }

    public getRandomRarityForCurrentState(availableRarities?: string[]): RarityId {
        const availableRaritiesHelperDataList: { config: IRarityConfigVO, weight: number }[] = [];

        let totalRaritiesWeight: number = this.getTotalRaritiesWeight(availableRarities);

        const finalRarity: IRarityValueVO[] = this.getFinalRarity();
        for (let singleRarity of finalRarity) {
            if (availableRarities) {
                if (availableRarities.indexOf(singleRarity.id) === -1) {
                    // Skip rarity if it's not in the list of allowed rarities
                    continue;
                }
            }

            const singleRarityConfig: IRarityConfigVO = this.getRarityConfig(singleRarity.id);
            availableRaritiesHelperDataList.push({
                config: singleRarityConfig,
                weight: singleRarity.value
            });
        }

        let result: RarityId;

        let totalSearchWeight: number = 0;
        const targetWeight: number = Math.random() * totalRaritiesWeight;
        //
        for (let singleRarityHelper of availableRaritiesHelperDataList) {
            totalSearchWeight += singleRarityHelper.weight;
            if (totalSearchWeight >= targetWeight) {
                result = singleRarityHelper.config.id;
                break;
            }
        }

        return result;
    }

    public getSymbolsForRarity(rarity: RarityId): DeepReadonly<IGameSlotSymbolConfigVO>[] {
        const result: DeepReadonly<IGameSlotSymbolConfigVO>[] = [];

        const reelTools: SlotReelTools = getInstance(SlotReelTools);
        for (let symbolId in this.reelsState.slot.static.symbols.configs) {
            const singleSymbolConfig: DeepReadonly<IGameSlotSymbolConfigVO> = reelTools.getSymbolConfig(symbolId) as IGameSlotSymbolConfigVO;
            if (singleSymbolConfig.rarity === rarity) {
                result.push(singleSymbolConfig);
            }
        }

        return result;
    }

    public getAllRaritiesSymbolConfigs(): IGameSlotSymbolConfigVO[] {
        const result: DeepReadonly<IGameSlotSymbolConfigVO>[] = [
            ...this.getSymbolsForRarity(RarityId.COMMON),
            ...this.getSymbolsForRarity(RarityId.UNCOMMON),
            ...this.getSymbolsForRarity(RarityId.RARE),
            ...this.getSymbolsForRarity(RarityId.EPIC)
        ];

        return result as IGameSlotSymbolConfigVO[];
    }

    public getSymbolConfigsByIds(symbolIds: readonly string[]): IGameSlotSymbolConfigVO[] {
        const reelTools: SlotReelTools = getInstance(SlotReelTools);

        const result: IGameSlotSymbolConfigVO[] = [];
        for (let singleSymbolId of symbolIds) {
            const tempSymbolConfig: IGameSlotSymbolConfigVO = reelTools.getSymbolConfig(singleSymbolId) as IGameSlotSymbolConfigVO;
            result.push(tempSymbolConfig);
        }

        return result;
    }

    // public getSingleSymbolConfig(symbolId: string): IGameSlotSymbolConfigVO {
    //     const result: IGameSlotSymbolConfigVO = this.reelsState.slot.static.symbols.configs[symbolId] as any;
    //     return result;
    // }

    public increaseTimesOnReelsForCurrentNonExtendedSymbols(): void {
        const reelTools: SlotReelTools = getInstance(SlotReelTools);
        const gameSymbolTools: GameSlotReelSymbolTools = getInstance(GameSlotReelSymbolTools);

        const mainSymbols: IReelSymbolVO[][] = reelTools.getCurrentNonExtendedSymbols();
        for (let singleReelSymbols of mainSymbols) {
            for (let singleSymbol of singleReelSymbols) {
                const symbolCompanionData: DeepReadonly<IGameSlotSymbolCompanionVO> = gameSymbolTools.getReelSymbolCompanionData(singleSymbol.tapeIndex, singleSymbol.tapePosition);

                const companionIndex: number = gameSymbolTools.getCompanionIndex(singleSymbol.tapeIndex, singleSymbol.tapePosition);

                appStorage().change<GameLogicModuleState>()(
                    `gameLogic.dynamic.availableSymbolCompanionDataList.${companionIndex}`,
                    {
                        timesOnReels: symbolCompanionData.timesOnReels + 1
                    }
                );

                // // IMPORTANT! this should be done only once across all the application!
                // // because this is the place where the counter of appearing on the reels is increased
                // symbolCompanionData.timesOnReels++;
                // // symbolCompanionData.counterValueToShow = interactionTools.getReelSymbolCompanionCounterValue(symbolCompanionData);
            }
        }
    }

    public processCounterDataForCurrentNonExtendedSymbols(): void {
        const reelTools: SlotReelTools = getInstance(SlotReelTools);
        const gameSymbolTools: GameSlotReelSymbolTools = getInstance(GameSlotReelSymbolTools);

        const mainSymbols: IReelSymbolVO[][] = reelTools.getCurrentNonExtendedSymbols();
        for (let singleReelSymbols of mainSymbols) {
            for (let singleSymbol of singleReelSymbols) {
                const symbolCompanionData: DeepReadonly<IGameSlotSymbolCompanionVO> = gameSymbolTools.getReelSymbolCompanionData(singleSymbol.tapeIndex, singleSymbol.tapePosition);
                const companionIndex: number = gameSymbolTools.getCompanionIndex(singleSymbol.tapeIndex, singleSymbol.tapePosition);

                if (symbolCompanionData) {
                    appStorage().change<GameLogicModuleState>()(
                        `gameLogic.dynamic.availableSymbolCompanionDataList.${companionIndex}`,
                        {
                            counterPrevProcessedValue: symbolCompanionData.counterValueToCheck
                        }
                    );
                }
            }
        }
    }

    public findSymbolsOnReels(config: IFindSymbolsOnReelsConfigVO): IGameReelSymbolVO[] {
        const result: IGameReelSymbolVO[] = [];

        const reelTools: SlotReelTools = getInstance(SlotReelTools);
        const currentSymbols: IGameReelSymbolVO[][] = reelTools.getCurrentNonExtendedSymbols() as IGameReelSymbolVO[][];
        for (let singleReelSymbols of currentSymbols) {
            for (let checkingSymbol of singleReelSymbols) {

                const checkingSymbolConfig: IGameSlotSymbolConfigVO = reelTools.getSymbolConfig(checkingSymbol.id) as IGameSlotSymbolConfigVO;

                let shouldIgnore: boolean = false;
                let shouldCount: boolean = false;
                //
                if (config.ignorePositions) {
                    for (let singleIgnorePos of config.ignorePositions) {
                        if (singleIgnorePos.x === checkingSymbol.position.x &&
                            singleIgnorePos.y === checkingSymbol.position.y) {

                            shouldIgnore = true;
                        }
                    }
                }
                if (config.checkPositions) {
                    let isInCheckPositions: boolean = false;
                    for (let singleCheckPos of config.checkPositions) {
                        if (singleCheckPos.x === checkingSymbol.position.x &&
                            singleCheckPos.y === checkingSymbol.position.y) {

                            isInCheckPositions = true;
                            break;
                        }
                    }

                    if (!isInCheckPositions) {
                        shouldIgnore = true;
                    }
                }

                if (config.ignoreSymbolIds) {
                    if (config.ignoreSymbolIds.indexOf(checkingSymbol.id) !== -1) {
                        shouldIgnore = true;
                    }
                }

                if (config.ignoreSymbolTags && checkingSymbolConfig.tags) {
                    for (let checkSymbolTag of checkingSymbolConfig.tags) {
                        if (config.ignoreSymbolTags.indexOf(checkSymbolTag) !== -1) {
                            shouldIgnore = true;
                            break;
                        }
                    }
                }

                if (config.randomValue || config.randomValue === 0) {
                    const gameSymbolTools: GameSlotReelSymbolTools = getInstance(GameSlotReelSymbolTools);
                    const checkingSymbolCompanionData: IGameSlotSymbolCompanionVO = gameSymbolTools.getReelSymbolCompanionData(checkingSymbol.tapeIndex, checkingSymbol.tapePosition);
                    if (checkingSymbolCompanionData) {
                        if (checkingSymbolCompanionData.lastWinActionRandomValue !== config.randomValue) {
                            shouldIgnore = true;
                        }

                    } else {
                        shouldIgnore = true;

                        //
                        console.log("WARNING! Can't find checkingSymbolCompanionData! checkingSymbol: ", checkingSymbol);
                    }
                }

                if (!shouldIgnore) {
                    if (config.symbolIds || config.symbolTags) {
                        if (config.symbolIds) {
                            if (config.symbolIds.indexOf(checkingSymbol.id) !== -1) {
                                shouldCount = true;
                            }
                        }

                        if (config.symbolTags && checkingSymbolConfig.tags) {
                            for (let checkSymbolTag of checkingSymbolConfig.tags) {
                                if (config.symbolTags.indexOf(checkSymbolTag) !== -1) {
                                    shouldCount = true;
                                    break;
                                }
                            }
                        }

                    } else {
                        // If there are no other specific requirements, then count the symbol
                        shouldCount = true;
                    }
                }

                if (shouldCount) {
                    result.push(checkingSymbol);
                }
            }
        }

        return result;
    }

    public getReelSymbolTotalValue(symbol: IGameReelSymbolVO): number {
        const reelTools: SlotReelTools = getInstance(SlotReelTools);
        const gameSymbolTools: GameSlotReelSymbolTools = getInstance(GameSlotReelSymbolTools);

        let result: number = 0;

        const symbolConfig: IGameSlotSymbolConfigVO = reelTools.getSymbolConfig(symbol.id) as IGameSlotSymbolConfigVO;
        if (symbolConfig) {
            result += symbolConfig.value;
        }

        const symbolCompanionData: IGameSlotSymbolCompanionVO = gameSymbolTools.getReelSymbolCompanionData(symbol.tapeIndex, symbol.tapePosition);
        if (symbolCompanionData) {
            result += symbolCompanionData.permanentValueChange;
        }

        return result;
    }
}