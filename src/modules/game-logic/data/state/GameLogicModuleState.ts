import { GameState } from "./GameState";
import { IFloorConfigVO } from "./IFloorConfigVO";
import { IMissionConfigVO } from "./IMissionConfigVO";
import { RarityId } from "../rarity/RarityId";
import { TemplateSettings } from "../../../../TemplateSettings";
import { IRarityConfigVO } from "../rarity/IRarityConfigVO";
import { IGameSlotSymbolCompanionVO } from "../../../game-slot-reels/data/symbols/IGameSlotSymbolCompanionVO";
import { GameSymbolId } from "../../../game-slot-reels/data/symbols/GameSymbolId";
import { IRarityValueVO } from "../rarity/IRarityValueVO";
import { DefaultSlotReelSetId } from "../../../slot-reels/data/reels/DefaultSlotReelSetId";

export const GameLogicModuleInitialState = {
    gameLogic: {
        dynamic: {
            state: GameState.WAIT_USER_ACTION as GameState,

            floorId: "" as string,
            missionId: "" as string,
            // missionIndex: 0 as number,

            coins: 0 as number,
            missionSpins: 0 as number,

            removes: 0 as number,
            rerolls: 0 as number,

            availableSymbolIds: [] as string[],
            availableSymbolCompanionDataList: [] as IGameSlotSymbolCompanionVO[],

            baseRarity: {} as Record<RarityId, number>,
            // finalRarity: {} as Record<RarityId, number>,
            curReelsRarityModCoefs: {} as Record<string, number>,

            nextSpinRequiredRarities: [] as string[],

            addSymbolsCount: 3 as number,

            reelSetsCompanionIndices: {
                [DefaultSlotReelSetId]: [] as number[][]
            } as Record<typeof DefaultSlotReelSetId, number[][]>
        },
        dynamicNotResettable: {
            openSymbolIds: [] as string[],
        },
        static: {
            rarities: {
                [RarityId.COMMON]: { id: RarityId.COMMON, color: TemplateSettings.colors.lightGrey, titleId: "rarities.common" },
                [RarityId.UNCOMMON]: { id: RarityId.UNCOMMON, color: TemplateSettings.colors.blue, titleId: "rarities.uncommon" },
                [RarityId.RARE]: { id: RarityId.RARE, color: TemplateSettings.colors.lightOrange, titleId: "rarities.rare" },
                [RarityId.EPIC]: { id: RarityId.EPIC, color: TemplateSettings.colors.lightViolet, titleId: "rarities.epic" }
            } as Record<string, IRarityConfigVO>,
            reels: {
                minSymbolsCount: 20,
                defaultSymbols: [GameSymbolId.COIN, GameSymbolId.FLOWER, GameSymbolId.CAT, GameSymbolId.PEARL, GameSymbolId.CHERRY] as string[]
            },
            floors: {
                floor1: {
                    missions: ["day1", "day2", "day3", "day4", "day5", "day6", "day7", "day8", "day9", "day10", "day11", "day12", "day13"]
                }
            } as Record<string, IFloorConfigVO>,
            missions: {
                default: {
                    id: "default",

                    texts: {
                        title: "gamePage.messagePopup.title",
                        day: "gamePage.messagePopup.day",
                        goal: "missions.default.goal",
                        message: "missions.default.message"
                    }
                },

                day1: {
                    id: "day1",

                    texts: {
                        message: "missions.mission1.message"
                    },

                    rarity: {
                        // [RarityId.COMMON]: 1,
                        [RarityId.COMMON]: 0.95,
                        // [RarityId.UNCOMMON]: 0,
                        [RarityId.UNCOMMON]: 0.05,
                        [RarityId.RARE]: 0,
                        [RarityId.EPIC]: 0
                    },

                    day: 1,
                    coins: 25,
                    // coins: 3,
                    spins: 5,
                    // spins: 1

                },
                day2: {
                    id: "day2",

                    texts: {
                        message: "missions.mission2.message"
                    },

                    rarity: {
                        [RarityId.COMMON]: 0.9,
                        [RarityId.UNCOMMON]: 0.1,
                        [RarityId.RARE]: 0,
                        [RarityId.EPIC]: 0
                    },

                    day: 2,
                    coins: 50,
                    spins: 5,

                    startBonus: {
                        symbols: {
                            availableRarities: [RarityId.UNCOMMON, RarityId.RARE, RarityId.EPIC]
                        }
                    }
                },
                day3: {
                    id: "day3",

                    texts: {
                        message: "missions.mission3.message"
                    },

                    rarity: {
                        [RarityId.COMMON]: 0.79,
                        [RarityId.UNCOMMON]: 0.2,
                        [RarityId.RARE]: 0.01,
                        [RarityId.EPIC]: 0
                    },

                    day: 3,
                    coins: 100,
                    spins: 6,

                    startBonus: {
                        symbols: {
                            availableRarities: [RarityId.UNCOMMON, RarityId.RARE, RarityId.EPIC]
                        }
                    }
                },
                day4: {
                    id: "day4",

                    texts: {
                        message: "missions.mission4.message"
                    },

                    rarity: {
                        [RarityId.COMMON]: 0.69,
                        [RarityId.UNCOMMON]: 0.29,
                        [RarityId.RARE]: 0.015,
                        [RarityId.EPIC]: 0.005
                    },

                    day: 4,
                    coins: 150,
                    spins: 6,

                    startBonus: {
                        rerolls: 2,
                        removes: 2,

                        symbols: {
                            availableRarities: [RarityId.UNCOMMON, RarityId.RARE, RarityId.EPIC]
                        }
                    }
                },
                day5: {
                    id: "day5",

                    texts: {
                        message: "missions.mission5.message"
                    },

                    rarity: {
                        [RarityId.COMMON]: 0.68,
                        [RarityId.UNCOMMON]: 0.30,
                        [RarityId.RARE]: 0.015,
                        [RarityId.EPIC]: 0.005
                    },

                    day: 5,
                    coins: 225,
                    spins: 7,

                    startBonus: {
                        symbols: {
                            allowedRarities: [RarityId.UNCOMMON, RarityId.RARE, RarityId.EPIC]
                        }
                    }
                },
                day6: {
                    id: "day6",

                    texts: {
                        message: "missions.mission6.message"
                    },

                    rarity: {
                        [RarityId.COMMON]: 0.60,
                        [RarityId.UNCOMMON]: 0.35,
                        [RarityId.RARE]: 0.035,
                        [RarityId.EPIC]: 0.015
                    },

                    day: 6,
                    coins: 275,
                    spins: 8,

                    startBonus: {
                        rerolls: 2,
                        removes: 2,

                        symbols: {
                            requiredRarities: [RarityId.RARE]
                        }
                    }
                },
                day7: {
                    id: "day7",

                    texts: {
                        message: "missions.mission7.message"
                    },

                    day: 7,
                    coins: 350,
                    spins: 8,

                    startBonus: {
                        symbols: {
                            requiredRarities: [RarityId.RARE]
                        }
                    }
                },
                day8: {
                    id: "day8",

                    texts: {
                        message: "missions.mission8.message"
                    },

                    day: 8,
                    coins: 425,
                    spins: 8,

                    startBonus: {
                        rerolls: 2,
                        removes: 2,

                        symbols: {
                            requiredRarities: [RarityId.RARE]
                        }
                    }
                },
                day9: {
                    id: "day9",

                    texts: {
                        message: "missions.mission9.message"
                    },

                    day: 9,
                    coins: 575,
                    spins: 9,

                    startBonus: {
                        symbols: {
                            requiredRarities: [RarityId.RARE, RarityId.RARE]
                        }
                    }
                },
                day10: {
                    id: "day10",

                    texts: {
                        message: "missions.mission10.message"
                    },

                    day: 10,
                    coins: 625,
                    spins: 9,

                    startBonus: {
                        rerolls: 2,
                        removes: 2,

                        symbols: {
                            allowedRarities: [RarityId.RARE, RarityId.EPIC]
                        }
                    }
                },
                day11: {
                    id: "day11",

                    texts: {
                        message: "missions.mission11.message"
                    },

                    day: 11,
                    coins: 675,
                    spins: 10,

                    startBonus: {
                        symbols: {
                            allowedRarities: [RarityId.RARE, RarityId.EPIC]
                        }
                    }
                },
                day12: {
                    id: "day12",

                    texts: {
                        message: "missions.mission12.message"
                    },

                    day: 12,
                    coins: 777,
                    spins: 10,

                    startBonus: {
                        rerolls: 2,
                        removes: 2,

                        symbols: {
                            allowedRarities: [RarityId.RARE, RarityId.EPIC]
                        }
                    }
                },
                day13: {
                    id: "day13",

                    texts: {
                        message: "missions.mission13.message"
                    },

                    day: 13,
                    coins: 1000,
                    spins: 10,

                    startBonus: {
                        rerolls: 1,
                        removes: 1,

                        symbols: {
                            allowedRarities: [RarityId.RARE, RarityId.EPIC]
                        }
                    }
                }
            } as Record<string, IMissionConfigVO>,

            // 5	5	6	6	7	7	8	8	9	9	10	10	10
            // 25	50	100	150	225	300	350	425	575	625	675	777	1000
        }
    }
};

export type GameLogicModuleState = typeof GameLogicModuleInitialState;