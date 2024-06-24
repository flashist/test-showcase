import { RarityId } from "../../../game-logic/data/rarity/RarityId";
import { GameSymbolId } from "../symbols/GameSymbolId";
import { IGameSlotSymbolConfigVO } from "../symbols/IGameSlotSymbolConfigVO";
import { GameSlotSymbolInteractionActionType } from "../interactions/GameSlotSymbolInteractionActionType";
import { GameSlotSymbolInteractionTriggerType } from "../interactions/GameSlotSymbolInteractionTriggerType";
import { GameSlotSymbolInteractionConditionType } from "../interactions/GameSlotSymbolInteractionConditionType";
import { GameSlotSymbolViewState } from "../symbols/GameSlotSymbolViewState";
import { GameSymbolTag } from "../symbols/GameSymbolTag";
import { InteractionPrioirities } from "./InteractionPrioirities";

export const GameSlotReelsModuleInitialState = {
    slot: {
        static: {
            reelSets: {
                default: {
                    weight: 0,
                    reels: []
                }
            },

            symbols: {
                zSortEnabled: false,

                defaultConfig: {
                    states: {
                        [GameSlotSymbolViewState.INTERACTION]: {
                            type: "wrapper"
                        },
                        [GameSlotSymbolViewState.DESTROYING]: {
                            type: "wrapper"
                        }
                    },
                },

                configs: {
                    amethyst: {
                        id: "amethyst",
                        tags: [GameSymbolTag.GEM],
                        value: 1,
                        rarity: RarityId.RARE,
                        titleId: "symbols.amethyst.title",
                        descriptionId: "symbols.amethyst.description",
                        states: {
                            normal: {
                                id: "Symbol_Amethyst",
                                type: "image"
                            }
                        },

                        valueChangeCounterVisible: true
                    },
                    anchor: {
                        id: "anchor",
                        value: 1,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.anchor.title",
                        descriptionId: "symbols.anchor.description",
                        states: {
                            normal: {
                                id: "Symbol_Anchor",
                                type: "image"
                            }
                        },
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.POSITIONS,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,
                                positions: [{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 0, y: 3 }, { x: 4, y: 3 }],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 4
                                    }
                                ]
                            }
                        ]
                    },
                    apple: {
                        id: "apple",
                        tags: [GameSymbolTag.FOOD],
                        value: 3,
                        rarity: RarityId.RARE,
                        titleId: "symbols.apple.title",
                        states: {
                            normal: {
                                id: "Symbol_Apple",
                                type: "image"
                            }
                        }
                    },
                    banana: {
                        id: "banana",
                        tags: [GameSymbolTag.FOOD],
                        value: 1,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.banana.title",
                        descriptionId: "symbols.banana.description",
                        states: {
                            normal: {
                                id: "Symbol_Banana",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_DESTROY,

                                actions: [
                                    {
                                        symbolIdsToCreate: [GameSymbolId.BANANA_PEEL]
                                    }
                                ]
                            }
                        ]
                    },
                    banana_peel: {
                        id: "banana_peel",
                        value: 1,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.banana_peel.title",
                        descriptionId: "symbols.banana_peel.description",
                        states: {
                            normal: {
                                id: "Symbol_Banana_Peel",
                                type: "image"
                            }
                        },
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,
                                symbolIds: [GameSymbolId.THIEF],

                                priority: InteractionPrioirities.DESTROY_SELF,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        destroying: true
                                    },
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        destroying: true
                                    }
                                ]
                            }
                        ]
                    },
                    bar_of_soap: {
                        id: "bar_of_soap",
                        value: 1,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.bar_of_soap.title",
                        descriptionId: "symbols.bar_of_soap.description",
                        states: {
                            normal: {
                                id: "Symbol_Bar_of_Soap",
                                type: "image"
                            }
                        },

                        counterVisible: true,
                        counter: 3,
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        symbolIdsToCreate: [GameSymbolId.BUBBLE]
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ACTIVE_COUNTER,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        counter: 1,
                                        ignoreAnim: true
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.COUNTER,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.DESTROY_SELF,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        destroying: true
                                    }
                                ]
                            }
                        ]
                    },
                    bartender: {
                        id: "bartender",
                        tags: [GameSymbolTag.HUMAN],
                        value: 3,
                        rarity: RarityId.RARE,
                        titleId: "symbols.bartender.title",
                        descriptionId: "symbols.bartender.description",
                        states: {
                            normal: {
                                id: "Symbol_Bartender",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.RANDOM,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                random: 0.1,
                                // TEST
                                // random: 1,

                                actions: [
                                    {
                                        randomSymbolIds: [GameSymbolId.BEER, GameSymbolId.WINE, GameSymbolId.MARTINI],
                                        randomSymbolIdsCount: 1,
                                        randomSymbolsUseRarity: true
                                    }
                                ]
                            }
                        ]
                    },
                    bear: {
                        id: "bear",
                        tags: [GameSymbolTag.ANIMAL],
                        value: 2,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.bear.title",
                        descriptionId: "symbols.bear.description",
                        states: {
                            normal: {
                                id: "Symbol_Bear",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolIds: [GameSymbolId.HONEY],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 40
                                    },
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        destroying: true
                                    }
                                ]
                            }
                        ]
                    },
                    beastmaster: {
                        id: "beastmaster",
                        tags: [GameSymbolTag.HUMAN],
                        value: 2,
                        rarity: RarityId.RARE,
                        titleId: "symbols.beastmaster.title",
                        descriptionId: "symbols.beastmaster.description",
                        states: {
                            normal: {
                                id: "Symbol_Beastmaster",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolTags: [GameSymbolTag.ANIMAL],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        coef: 2
                                    }
                                ]
                            }
                        ]
                    },
                    bee: {
                        id: "bee",
                        tags: [GameSymbolTag.ANIMAL],
                        value: 1,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.bee.title",
                        descriptionId: "symbols.bee.description",
                        states: {
                            normal: {
                                id: "Symbol_Bee",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolIds: [GameSymbolId.FLOWER, GameSymbolId.BEEHIVE, GameSymbolId.HONEY],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 1
                                    },
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        coef: 2
                                    }
                                ]
                            }
                        ]
                    },
                    beehive: {
                        id: "beehive",
                        value: 3,
                        rarity: RarityId.RARE,
                        titleId: "symbols.beehive.title",
                        descriptionId: "symbols.beehive.description",
                        states: {
                            normal: {
                                id: "Symbol_Beehive",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.RANDOM,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.DESTROY_SELF,

                                random: 0.1,
                                // TEST
                                //random: 1,

                                actions: [
                                    {
                                        symbolIdsToCreate: [GameSymbolId.HONEY]
                                    }
                                ]
                            }
                        ]
                    },
                    beer: {
                        id: "beer",
                        tags: [GameSymbolTag.FOOD],
                        value: 1,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.beer.title",
                        states: {
                            normal: {
                                id: "Symbol_Beer",
                                type: "image"
                            }
                        }
                    },
                    big_ore: {
                        id: "big_ore",
                        value: 2,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.big_ore.title",
                        descriptionId: "symbols.big_ore.description",
                        states: {
                            normal: {
                                id: "Symbol_Big_Ore",
                                type: "image"
                            }
                        },
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_DESTROY,

                                actions: [
                                    {
                                        randomSymbolIds: [GameSymbolId.VOID_STONE, GameSymbolId.AMETHYST, GameSymbolId.PEARL, GameSymbolId.SHINY_PEBBLE, GameSymbolId.SAPPHIRE, GameSymbolId.EMERALD, GameSymbolId.RUBY, GameSymbolId.DIAMOND_GEM],
                                        randomSymbolIdsCount: 2,
                                        randomSymbolsUseRarity: true
                                    }
                                ]
                            }
                        ]
                    },
                    big_urn: {
                        id: "big_urn",
                        value: 2,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.big_urn.title",
                        descriptionId: "symbols.big_urn.description",
                        states: {
                            normal: {
                                id: "Symbol_Big_Urn",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_DESTROY,

                                actions: [
                                    {
                                        symbolIdsToCreate: [GameSymbolId.GHOST, GameSymbolId.GHOST]
                                    }
                                ]
                            }
                        ]
                    },
                    billionaire: {
                        id: "billionaire",
                        tags: [GameSymbolTag.HUMAN],
                        value: 0,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.billionaire.title",
                        descriptionId: "symbols.billionaire.description",
                        states: {
                            normal: {
                                id: "Symbol_Billionaire",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolIds: [GameSymbolId.CHEESE, GameSymbolId.WINE],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        coef: 2
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_DESTROY,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 39
                                    }
                                ]
                            }
                        ]
                    },
                    bow_wooden: {
                        id: "bow_wooden",
                        value: 0,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.bow_wooden.title",
                        descriptionId: "symbols.bow_wooden.description",
                        states: {
                            normal: {
                                id: "Symbol_Bow_Wooden",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.GENERATE_RANDOM,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        minRandomNumber: 0,
                                        maxRandomNumber: 1
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.DIRECTION_SYMBOLS,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                useLastRandomNumber: true,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        coef: 2
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.DIRECTION_SYMBOLS,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                useLastRandomNumber: true,
                                symbolIds: [GameSymbolId.TARGET],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        destroying: true
                                    }
                                ]
                            },

                            {
                                conditionType: GameSlotSymbolInteractionConditionType.DIRECTION_SYMBOLS,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,
                                priority: InteractionPrioirities.INCREASE_TARGET,

                                useLastRandomNumber: true,
                                symbolIds: [GameSymbolId.AMETHYST, GameSymbolId.PEAR],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        permanentValueChange: 1
                                    }
                                ]
                            }
                        ]
                    },
                    bow_silver: {
                        id: "bow_silver",
                        value: 0,
                        rarity: RarityId.RARE,
                        titleId: "symbols.bow_silver.title",
                        descriptionId: "symbols.bow_silver.description",
                        states: {
                            normal: {
                                id: "Symbol_Bow_Silver",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.GENERATE_RANDOM,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        minRandomNumber: 0,
                                        maxRandomNumber: 1
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.DIRECTION_SYMBOLS,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                useLastRandomNumber: true,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        coef: 3
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.DIRECTION_SYMBOLS,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                useLastRandomNumber: true,
                                symbolIds: [GameSymbolId.TARGET],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        destroying: true
                                    }
                                ]
                            },

                            {
                                conditionType: GameSlotSymbolInteractionConditionType.DIRECTION_SYMBOLS,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,
                                priority: InteractionPrioirities.INCREASE_TARGET,

                                useLastRandomNumber: true,
                                symbolIds: [GameSymbolId.AMETHYST, GameSymbolId.PEAR],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        permanentValueChange: 1
                                    }
                                ]
                            }
                        ]
                    },
                    bow_golden: {
                        id: "bow_golden",
                        value: 0,
                        rarity: RarityId.EPIC,
                        titleId: "symbols.bow_golden.title",
                        descriptionId: "symbols.bow_golden.description",
                        states: {
                            normal: {
                                id: "Symbol_Bow_Gold",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.GENERATE_RANDOM,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        minRandomNumber: 0,
                                        maxRandomNumber: 1
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.DIRECTION_SYMBOLS,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                useLastRandomNumber: true,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        coef: 4
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.DIRECTION_SYMBOLS,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                useLastRandomNumber: true,
                                symbolIds: [GameSymbolId.TARGET],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        destroying: true
                                    }
                                ]
                            },

                            {
                                conditionType: GameSlotSymbolInteractionConditionType.DIRECTION_SYMBOLS,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,
                                priority: InteractionPrioirities.INCREASE_TARGET,

                                useLastRandomNumber: true,
                                symbolIds: [GameSymbolId.AMETHYST, GameSymbolId.PEAR],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        permanentValueChange: 1
                                    }
                                ]
                            }
                        ]
                    },

                    policeman: {
                        id: "policeman",
                        tags: [GameSymbolTag.HUMAN],
                        value: 1,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.policeman.title",
                        descriptionId: "symbols.policeman.description",
                        states: {
                            normal: {
                                id: "Symbol_Policeman",
                                type: "image"
                            }
                        },
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolIds: [GameSymbolId.THIEF],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 20
                                    },
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        destroying: true
                                    }
                                ]
                            }
                        ]
                    },
                    bubble: {
                        id: "bubble",
                        value: 2,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.bubble.title",
                        descriptionId: "symbols.bubble.description",
                        states: {
                            normal: {
                                id: "Symbol_Bubble",
                                type: "image"
                            }
                        },

                        counterVisible: true,
                        counter: 3,
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        counter: 1,
                                        ignoreAnim: true
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.COUNTER,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.DESTROY_SELF,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        destroying: true
                                    }
                                ]
                            }
                        ]
                    },
                    buffing_capsule: {
                        id: "buffing_capsule",
                        value: 0,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.buffing_capsule.title",
                        descriptionId: "symbols.buffing_capsule.description",
                        states: {
                            normal: {
                                id: "Symbol_Buffing_Capsule",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        coef: 2
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.DESTROY_SELF,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        destroying: true
                                    }
                                ]
                            },

                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.INCREASE_TARGET,
                                symbolIds: [GameSymbolId.AMETHYST],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        permanentValueChange: 1
                                    }
                                ]
                            },

                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.INCREASE_TARGET,
                                symbolIds: [GameSymbolId.PEAR],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        permanentValueChange: 1
                                    }
                                ]
                            }
                        ]
                    },
                    candy: {
                        id: "candy",
                        tags: [GameSymbolTag.FOOD],
                        value: 1,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.candy.title",
                        states: {
                            normal: {
                                id: "Symbol_Candy",
                                type: "image"
                            }
                        }
                    },
                    card_shark: {
                        id: "card_shark",
                        tags: [GameSymbolTag.HUMAN],
                        value: 2,
                        rarity: RarityId.RARE,
                        titleId: "symbols.card_shark.title",
                        descriptionId: "symbols.card_shark.description",
                        states: {
                            normal: {
                                id: "Symbol_Card_Shark",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolIds: [GameSymbolId.DIAMONDS, GameSymbolId.HEARTS, GameSymbolId.SPADES, GameSymbolId.CLUBS],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        coef: 2
                                    }
                                ]
                            }
                        ]
                    },
                    cat: {
                        id: "cat",
                        tags: [GameSymbolTag.ANIMAL],
                        value: 1,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.cat.title",
                        descriptionId: "symbols.cat.description",
                        states: {
                            normal: {
                                id: "Symbol_Cat",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolIds: [GameSymbolId.MILK],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 9
                                    },
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        destroying: true
                                    }
                                ]
                            }
                        ]
                    },
                    cheese: {
                        id: "cheese",
                        tags: [GameSymbolTag.FOOD],
                        value: 1,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.cheese.title",
                        states: {
                            normal: {
                                id: "Symbol_Cheese",
                                type: "image"
                            }
                        }
                    },
                    chef: {
                        id: "chef",
                        tags: [GameSymbolTag.HUMAN],
                        value: 2,
                        rarity: RarityId.RARE,
                        titleId: "symbols.chef.title",
                        descriptionId: "symbols.chef.description",
                        states: {
                            normal: {
                                id: "Symbol_Chef",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolTags: [GameSymbolTag.FOOD],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        coef: 2
                                    }
                                ]
                            },

                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.INCREASE_TARGET,
                                symbolIds: [GameSymbolId.PEAR],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        permanentValueChange: 1
                                    }
                                ]
                            }
                        ]
                    },
                    // chemical_seven: {
                    //     id: "chemical_seven",
                    //     value: 0,
                    //     rarity: RarityId.UNCOMMON,
                    //     titleId: "symbols.chemical_seven.title",
                    //     descriptionId: "symbols.chemical_seven.description",
                    //     states: {
                    //         normal: {
                    //             id: "Symbol_Chemical_Seven",
                    //             type: "image"
                    //         }
                    //     }
                    // },
                    cherry: {
                        id: "cherry",
                        tags: [GameSymbolTag.FOOD],
                        value: 1,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.cherry.title",
                        states: {
                            normal: {
                                id: "Symbol_Cherry",
                                type: "image"
                            }
                        }
                    },
                    chick: {
                        id: "chick",
                        tags: [GameSymbolTag.ANIMAL],
                        value: 1,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.chick.title",
                        descriptionId: "symbols.chick.description",
                        states: {
                            normal: {
                                id: "Symbol_Chick",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.RANDOM,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.DESTROY_SELF,

                                random: 0.1,
                                // TEST
                                // random: 1,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        destroying: true
                                    },
                                    {
                                        symbolIdsToCreate: [GameSymbolId.CHICKEN]
                                    }
                                ]
                            }
                        ]
                    },
                    chicken: {
                        id: "chicken",
                        tags: [GameSymbolTag.ANIMAL],
                        value: 2,
                        rarity: RarityId.RARE,
                        titleId: "symbols.chicken.title",
                        descriptionId: "symbols.chicken.description",
                        states: {
                            normal: {
                                id: "Symbol_Chicken",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.RANDOM,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                random: 0.05,
                                // TEST
                                // random: 1,

                                actions: [
                                    {
                                        symbolIdsToCreate: [GameSymbolId.EGG]
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.RANDOM,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                random: 0.01,
                                // TEST
                                // random: 1,

                                actions: [
                                    {
                                        symbolIdsToCreate: [GameSymbolId.GOLDEN_EGG]
                                    }
                                ]
                            }
                        ]
                    },
                    clubs: {
                        id: "clubs",
                        value: 1,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.clubs.title",
                        descriptionId: "symbols.clubs.description",
                        states: {
                            normal: {
                                id: "Symbol_Cards_Clubs",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,
                                symbolIds: [GameSymbolId.SPADES, GameSymbolId.CLUBS],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        value: 1
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.SYMBOLS_ON_REELS,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,
                                symbolIds: [GameSymbolId.SPADES, GameSymbolId.CLUBS, GameSymbolId.DIAMONDS, GameSymbolId.HEARTS],
                                minSymbolsCount: 3,
                                countSelf: true,

                                maxRepeatCount: 1,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 1
                                    }
                                ]
                            }
                        ]
                    },
                    coal: {
                        id: "coal",
                        value: 0,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.coal.title",
                        descriptionId: "symbols.coal.description",
                        states: {
                            normal: {
                                id: "Symbol_Coal",
                                type: "image"
                            }
                        },

                        counterVisible: true,
                        counter: 20,
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ACTIVE_COUNTER,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        counter: 1,
                                        ignoreAnim: true
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.COUNTER,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.DESTROY_SELF,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        destroying: true
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_DESTROY,

                                actions: [
                                    {
                                        symbolIdsToCreate: [GameSymbolId.DIAMOND_GEM]
                                    }
                                ]
                            }
                        ]
                    },
                    coconut: {
                        id: "coconut",
                        tags: [GameSymbolTag.FOOD],
                        value: 1,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.coconut.title",
                        descriptionId: "symbols.coconut.description",
                        states: {
                            normal: {
                                id: "Symbol_Coconut",
                                type: "image"
                            }
                        },
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_DESTROY,

                                actions: [
                                    {
                                        symbolIdsToCreate: [GameSymbolId.COCONUT_HALF, GameSymbolId.COCONUT_HALF]
                                    }
                                ]
                            }
                        ]
                    },
                    coconut_half: {
                        id: "coconut_half",
                        tags: [GameSymbolTag.FOOD],
                        value: 2,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.coconut_half.title",
                        states: {
                            normal: {
                                id: "Symbol_Coconut_Half",
                                type: "image"
                            }
                        }
                    },
                    coin: {
                        id: "coin",
                        value: 1,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.coin.title",
                        states: {
                            normal: {
                                id: "Symbol_Coin",
                                type: "image"
                            }
                        }
                    },
                    clown: {
                        id: "clown",
                        tags: [GameSymbolTag.HUMAN],
                        value: 3,
                        rarity: RarityId.RARE,
                        titleId: "symbols.clown.title",
                        descriptionId: "symbols.clown.description",
                        states: {
                            normal: {
                                id: "Symbol_Clown",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolIds: [GameSymbolId.BANANA, GameSymbolId.BANANA_PEEL, GameSymbolId.DOG, GameSymbolId.MONKEY, GameSymbolId.TODDLER, GameSymbolId.JOKER],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        coef: 3
                                    }
                                ]
                            }
                        ]
                    },
                    cow: {
                        id: "cow",
                        tags: [GameSymbolTag.ANIMAL],
                        value: 3,
                        rarity: RarityId.RARE,
                        titleId: "symbols.cow.title",
                        descriptionId: "symbols.cow.description",
                        states: {
                            normal: {
                                id: "Symbol_Cow",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.RANDOM,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                random: 0.15,
                                // TEST
                                // random: 1,

                                actions: [
                                    {
                                        symbolIdsToCreate: [GameSymbolId.MILK]
                                    }
                                ]
                            }
                        ]
                    },
                    crab: {
                        id: "crab",
                        tags: [GameSymbolTag.ANIMAL],
                        value: 1,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.crab.title",
                        descriptionId: "symbols.crab.description",
                        states: {
                            normal: {
                                id: "Symbol_Crab",
                                type: "image"
                            }
                        },
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.SYMBOLS_ON_REELS,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,
                                symbolIds: [GameSymbolId.CRAB],
                                shouldBeSameY: true,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 3
                                    }
                                ]
                            }
                        ]
                    },
                    crow: {
                        id: "crow",
                        tags: [GameSymbolTag.ANIMAL],
                        value: 2,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.crow.title",
                        descriptionId: "symbols.crow.description",

                        counterVisible: true,
                        counter: 4,

                        states: {
                            normal: {
                                id: "Symbol_Crow",
                                type: "image"
                            }
                        },
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        counter: 1,
                                        ignoreAnim: true
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.COUNTER,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [{
                                    type: GameSlotSymbolInteractionActionType.SELF,
                                    value: -3
                                }]
                            }
                        ]
                    },
                    cultist: {
                        id: "cultist",
                        tags: [GameSymbolTag.HUMAN],
                        value: 0,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.cultist.title",
                        descriptionId: "symbols.cultist.description",
                        states: {
                            normal: {
                                id: "Symbol_Cultist",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.SYMBOLS_ON_REELS,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,
                                symbolIds: [GameSymbolId.CULTIST],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 1
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.SYMBOLS_ON_REELS,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,
                                symbolIds: [GameSymbolId.CULTIST],
                                minSymbolsCount: 3,
                                countSelf: true,

                                maxRepeatCount: 1,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 1
                                    }
                                ]
                            }
                        ]
                    },
                    dame: {
                        id: "dame",
                        tags: [GameSymbolTag.HUMAN],
                        value: 2,
                        rarity: RarityId.RARE,
                        titleId: "symbols.dame.title",
                        descriptionId: "symbols.dame.description",
                        states: {
                            normal: {
                                id: "Symbol_Dame",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.INCREASE_TARGET,
                                symbolIds: [GameSymbolId.AMETHYST],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        permanentValueChange: 1
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolTags: [GameSymbolTag.GEM],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        coef: 2
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolIds: [GameSymbolId.MARTINI],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 40
                                    },
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        destroying: true
                                    }
                                ]
                            }
                        ]
                    },
                    diamond_gem: {
                        id: "diamond_gem",
                        tags: [GameSymbolTag.GEM],
                        value: 5,
                        rarity: RarityId.EPIC,
                        titleId: "symbols.diamond_gem.title",
                        descriptionId: "symbols.diamond_gem.description",
                        states: {
                            normal: {
                                id: "Symbol_Diamond_Gem",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.SYMBOLS_ON_REELS,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,
                                symbolIds: [GameSymbolId.DIAMOND_GEM],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 1
                                    }
                                ]
                            }
                        ]
                    },
                    diamonds: {
                        id: "diamonds",
                        value: 1,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.diamonds.title",
                        descriptionId: "symbols.diamonds.description",
                        states: {
                            normal: {
                                id: "Symbol_Cards_Diamonds",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,
                                symbolIds: [GameSymbolId.DIAMONDS, GameSymbolId.HEARTS],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        value: 1
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.SYMBOLS_ON_REELS,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,
                                symbolIds: [GameSymbolId.SPADES, GameSymbolId.CLUBS, GameSymbolId.DIAMONDS, GameSymbolId.HEARTS],
                                minSymbolsCount: 3,
                                countSelf: true,

                                maxRepeatCount: 1,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 1
                                    }
                                ]
                            }
                        ]
                    },
                    diver: {
                        id: "diver",
                        tags: [GameSymbolTag.HUMAN],
                        value: 2,
                        rarity: RarityId.RARE,
                        titleId: "symbols.diver.title",
                        descriptionId: "symbols.diver.description",
                        states: {
                            normal: {
                                id: "Symbol_Diver",
                                type: "image"
                            }
                        },

                        valueChangeCounterVisible: true,
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolIds: [GameSymbolId.SNAIL, GameSymbolId.TURTLE, GameSymbolId.ANCHOR, GameSymbolId.CRAB, GameSymbolId.GOLDFISH, GameSymbolId.OYSTER, GameSymbolId.PEARL, GameSymbolId.JELLYFISH, GameSymbolId.PUFFERFISH],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        permanentValueChange: 1
                                    },
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        destroying: true
                                    }
                                ]
                            }
                        ]
                    },
                    dog: {
                        id: "dog",
                        tags: [GameSymbolTag.ANIMAL],
                        value: 1,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.dog.title",
                        descriptionId: "symbols.dog.description",
                        states: {
                            normal: {
                                id: "Symbol_Dog",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolTags: [GameSymbolTag.HUMAN],
                                maxRepeatCount: 1,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 1
                                    }
                                ]
                            }
                        ]
                    },
                    // dove: {
                    //     id: "dove",
                    //     tags: [GameSymbolTag.ANIMAL],
                    //     value: 2,
                    //     rarity: RarityId.RARE,
                    //     titleId: "symbols.dove.title",
                    //     descriptionId: "symbols.dove.description",
                    //     states: {
                    //         normal: {
                    //             id: "Symbol_Dove",
                    //             type: "image"
                    //         }
                    //     }
                    // },
                    dud: {
                        id: "dud",
                        value: 0,
                        rarity: RarityId.NONE,
                        titleId: "symbols.dud.title",
                        descriptionId: "symbols.dud.description",
                        states: {
                            normal: {
                                id: "Symbol_Dud",
                                type: "image"
                            }
                        }
                    },
                    dwarf: {
                        id: "dwarf",
                        tags: [GameSymbolTag.HUMAN],
                        value: 1,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.dwarf.title",
                        descriptionId: "symbols.dwarf.description",
                        states: {
                            normal: {
                                id: "Symbol_Dwarf",
                                type: "image"
                            }
                        },
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolIds: [GameSymbolId.BEER, GameSymbolId.WINE],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        targetValueCoef: 10
                                    },
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        destroying: true
                                    }
                                ]
                            }
                        ]
                    },
                    egg: {
                        id: "egg",
                        tags: [GameSymbolTag.FOOD],
                        value: 1,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.egg.title",
                        descriptionId: "symbols.egg.description",
                        states: {
                            normal: {
                                id: "Symbol_Egg",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.RANDOM,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.DESTROY_SELF,

                                random: 0.1,
                                // TEST
                                // random: 1,

                                actions: [
                                    {
                                        symbolIdsToCreate: [GameSymbolId.CHICK]
                                    },
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        destroying: true
                                    }
                                ]
                            }
                        ]
                    },
                    eldritch_creature: {
                        id: "eldritch_creature",
                        tags: [GameSymbolTag.ANIMAL],
                        value: 4,
                        rarity: RarityId.EPIC,
                        titleId: "symbols.eldritch_creature.title",
                        descriptionId: "symbols.eldritch_creature.description",
                        states: {
                            normal: {
                                id: "Symbol_Eldritch_Creature",
                                type: "image"
                            }
                        },

                        valueChangeCounterVisible: true,
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolIds: [GameSymbolId.CULTIST, GameSymbolId.WITCH, GameSymbolId.HEX_OF_DESTRUCTION, GameSymbolId.HEX_OF_DRAINING, GameSymbolId.HEX_OF_MIDAS, GameSymbolId.HEX_OF_TEDIUM, GameSymbolId.HEX_OF_THIEVERY],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        permanentValueChange: 1
                                    },
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        destroying: true
                                    }
                                ]
                            }
                        ]
                    },
                    emerald: {
                        id: "emerald",
                        tags: [GameSymbolTag.GEM],
                        value: 3,
                        rarity: RarityId.RARE,
                        titleId: "symbols.emerald.title",
                        descriptionId: "symbols.emerald.description",
                        states: {
                            normal: {
                                id: "Symbol_Emerald",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.SYMBOLS_ON_REELS,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,
                                symbolIds: [GameSymbolId.EMERALD],
                                minSymbolsCount: 2,
                                countSelf: true,

                                maxRepeatCount: 1,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 1
                                    }
                                ]
                            }
                        ]
                    },
                    empty: {
                        id: "empty",
                        value: 0,
                        rarity: RarityId.NONE,
                        titleId: "symbols.empty.title",
                        states: {
                            normal: {
                                id: "Symbol_Empty",
                                type: "image"
                            }
                        }
                    },
                    // essence_capsule: {
                    //     id: "essence_capsule",
                    //     value: -12,
                    //     rarity: RarityId.UNCOMMON,
                    //     titleId: "symbols.essence_capsule.title",
                    //     descriptionId: "symbols.essence_capsule.description",
                    //     states: {
                    //         normal: {
                    //             id: "Symbol_Essence_Capsule",
                    //             type: "image"
                    //         }
                    //     }
                    // },
                    farmer: {
                        id: "farmer",
                        tags: [GameSymbolTag.HUMAN],
                        value: 2,
                        rarity: RarityId.RARE,
                        titleId: "symbols.farmer.title",
                        descriptionId: "symbols.farmer.description",
                        states: {
                            normal: {
                                id: "Symbol_Farmer",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolIds: [GameSymbolId.VOID_FRUIT, GameSymbolId.BANANA, GameSymbolId.CHEESE, GameSymbolId.CHERRY, GameSymbolId.CHICK, GameSymbolId.COCONUT, GameSymbolId.SEED, GameSymbolId.EGG, GameSymbolId.FLOWER, GameSymbolId.MILK, GameSymbolId.PEAR, GameSymbolId.CHICKEN, GameSymbolId.ORANGE, GameSymbolId.PEACH, GameSymbolId.STRAWBERRY, GameSymbolId.GOLDEN_EGG, GameSymbolId.COW, GameSymbolId.APPLE, GameSymbolId.WATERMELON],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        coef: 2
                                    }
                                ]
                            },

                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.INCREASE_TARGET,
                                symbolIds: [GameSymbolId.PEAR],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        permanentValueChange: 1
                                    }
                                ]
                            }
                        ]
                    },
                    five_sided_die: {
                        id: "five_sided_die",
                        value: 0,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.five_sided_die.title",
                        descriptionId: "symbols.five_sided_die.description",
                        states: {
                            normal: {
                                id: "Symbol_Die_D5_0",
                                type: "image"
                            }
                        },
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        minRandomValue: 1,
                                        maxRandomValue: 5
                                    }
                                ]
                            }
                        ]
                    },
                    flower: {
                        id: "flower",
                        value: 1,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.flower.title",
                        states: {
                            normal: {
                                id: "Symbol_Flower",
                                type: "image"
                            }
                        }
                    },
                    frozen_fossil: {
                        id: "frozen_fossil",
                        value: 0,
                        rarity: RarityId.RARE,
                        titleId: "symbols.frozen_fossil.title",
                        descriptionId: "symbols.frozen_fossil.description",
                        states: {
                            normal: {
                                id: "Symbol_Frozen_Fossil",
                                type: "image"
                            }
                        },

                        counterVisible: true,
                        counter: 10,
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ACTIVE_COUNTER,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        counter: 1,
                                        ignoreAnim: true
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.COUNTER,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.DESTROY_SELF,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        destroying: true
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_DESTROY,

                                actions: [
                                    {
                                        symbolIdsToCreate: [GameSymbolId.ELDRITCH_CREATURE]
                                    }
                                ]
                            }
                        ]
                    },
                    gambler: {
                        id: "gambler",
                        tags: [GameSymbolTag.HUMAN],
                        value: 1,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.gambler.title",
                        descriptionId: "symbols.gambler.description",

                        valueCounterVisible: true,

                        states: {
                            normal: {
                                id: "Symbol_Gambler",
                                type: "image"
                            }
                        },
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_DESTROY,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        useValueCounter: true
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        valueCounter: 2
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.SYMBOLS_ON_REELS,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolIds: [GameSymbolId.THREE_SIDED_DIE, GameSymbolId.FIVE_SIDED_DIE],
                                targetRandomToTrigger: 1,

                                priority: InteractionPrioirities.DESTROY_SELF,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        destroying: true
                                    }
                                ]
                            }
                        ]
                    },
                    supervillain: {
                        id: "supervillain",
                        tags: [GameSymbolTag.HUMAN],
                        value: 1,
                        rarity: RarityId.RARE,
                        titleId: "symbols.supervillain.title",
                        descriptionId: "symbols.supervillain.description",
                        states: {
                            normal: {
                                id: "Symbol_Supervillain",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolTags: [GameSymbolTag.HUMAN],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 20
                                    },
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        destroying: true
                                    }
                                ]
                            }
                        ]
                    },
                    geologist: {
                        id: "geologist",
                        tags: [GameSymbolTag.HUMAN],
                        value: 2,
                        rarity: RarityId.RARE,
                        titleId: "symbols.geologist.title",
                        descriptionId: "symbols.geologist.description",
                        states: {
                            normal: {
                                id: "Symbol_Geologist",
                                type: "image"
                            }
                        },

                        valueChangeCounterVisible: true,
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolIds: [GameSymbolId.ORE, GameSymbolId.BIG_ORE, GameSymbolId.PEARL, GameSymbolId.SHINY_PEBBLE, GameSymbolId.SAPPHIRE],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        permanentValueChange: 1
                                    },
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        destroying: true
                                    }
                                ]
                            }
                        ]
                    },
                    golden_egg: {
                        id: "golden_egg",
                        tags: [GameSymbolTag.FOOD],
                        value: 4,
                        rarity: RarityId.RARE,
                        titleId: "symbols.golden_egg.title",
                        states: {
                            normal: {
                                id: "Symbol_Golden_Egg",
                                type: "image"
                            }
                        }
                    },
                    goldfish: {
                        id: "goldfish",
                        tags: [GameSymbolTag.ANIMAL],
                        value: 1,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.goldfish.title",
                        descriptionId: "symbols.goldfish.description",
                        states: {
                            normal: {
                                id: "Symbol_Goldfish",
                                type: "image"
                            }
                        },
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolIds: [GameSymbolId.BUBBLE],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 15
                                    },
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        destroying: true
                                    }
                                ]
                            }
                        ]
                    },
                    golem: {
                        id: "golem",
                        value: 0,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.golem.title",
                        descriptionId: "symbols.golem.description",
                        states: {
                            normal: {
                                id: "Symbol_Golem",
                                type: "image"
                            }
                        },

                        counterVisible: true,
                        counter: 5,
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ACTIVE_COUNTER,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        counter: 1,
                                        ignoreAnim: true
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.COUNTER,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.DESTROY_SELF,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        destroying: true
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_DESTROY,

                                actions: [
                                    {
                                        symbolIdsToCreate: [GameSymbolId.ORE, GameSymbolId.ORE, GameSymbolId.ORE, GameSymbolId.ORE, GameSymbolId.ORE]
                                    }
                                ]
                            }
                        ]
                    },
                    goose: {
                        id: "goose",
                        tags: [GameSymbolTag.ANIMAL],
                        value: 1,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.goose.title",
                        descriptionId: "symbols.goose.description",
                        states: {
                            normal: {
                                id: "Symbol_Goose",
                                type: "image"
                            }
                        },
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.RANDOM,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                random: 0.01,
                                // TEST
                                // random: 1,

                                actions: [
                                    {
                                        symbolIdsToCreate: [GameSymbolId.GOLDEN_EGG]
                                    }
                                ]
                            }
                        ]
                    },
                    hearts: {
                        id: "hearts",
                        value: 1,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.hearts.title",
                        descriptionId: "symbols.hearts.description",
                        states: {
                            normal: {
                                id: "Symbol_Cards_Hearts",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,
                                symbolIds: [GameSymbolId.DIAMONDS, GameSymbolId.HEARTS],


                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        value: 1
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.SYMBOLS_ON_REELS,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,
                                symbolIds: [GameSymbolId.SPADES, GameSymbolId.CLUBS, GameSymbolId.DIAMONDS, GameSymbolId.HEARTS],
                                minSymbolsCount: 3,
                                countSelf: true,

                                maxRepeatCount: 1,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 1
                                    }
                                ]
                            }
                        ]
                    },
                    hex_of_destruction: {
                        id: "hex_of_destruction",
                        value: 3,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.hex_of_destruction.title",
                        descriptionId: "symbols.hex_of_destruction.description",
                        states: {
                            normal: {
                                id: "Symbol_Hex_of_Destruction",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                random: 0.33,

                                ignoreSymbolIds: [GameSymbolId.EMPTY],
                                findRandomAdjacent: true,
                                maxSymbolsCount: 1,

                                priority: InteractionPrioirities.DESTROY_SELF,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF
                                    },
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        destroying: true
                                    }
                                ]
                            }
                        ]
                    },
                    hex_of_draining: {
                        id: "hex_of_draining",
                        value: 3,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.hex_of_draining.title",
                        descriptionId: "symbols.hex_of_draining.description",
                        states: {
                            normal: {
                                id: "Symbol_Hex_of_Draining",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                random: 0.33,

                                ignoreSymbolIds: [GameSymbolId.EMPTY],
                                findRandomAdjacent: true,
                                maxSymbolsCount: 1,

                                priority: InteractionPrioirities.DESTROY_SELF,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF
                                    },
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        coef: 0
                                    }
                                ]
                            }
                        ]
                    },
                    // hex_of_emptiness: {
                    //     id: "hex_of_emptiness",
                    //     value: 3,
                    //     rarity: RarityId.UNCOMMON,
                    //     titleId: "symbols.hex_of_emptiness.title",
                    //     descriptionId: "symbols.hex_of_emptiness.description",
                    //     states: {
                    //         normal: {
                    //             id: "Symbol_Hex_of_Emptiness",
                    //             type: "image"
                    //         }
                    //     }
                    // },
                    // hex_of_hoarding: {
                    //     id: "hex_of_hoarding",
                    //     value: 3,
                    //     rarity: RarityId.UNCOMMON,
                    //     titleId: "symbols.hex_of_hoarding.title",
                    //     descriptionId: "symbols.hex_of_hoarding.description",
                    //     states: {
                    //         normal: {
                    //             id: "Symbol_Hex_of_Hoarding",
                    //             type: "image"
                    //         }
                    //     }
                    // },
                    hex_of_midas: {
                        id: "hex_of_midas",
                        value: 3,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.hex_of_midas.title",
                        descriptionId: "symbols.hex_of_midas.description",
                        states: {
                            normal: {
                                id: "Symbol_Hex_of_Midas",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.RANDOM,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                random: 0.33,

                                actions: [
                                    {
                                        symbolIdsToCreate: [GameSymbolId.COIN]
                                    }
                                ]
                            }
                        ]
                    },
                    hex_of_tedium: {
                        id: "hex_of_tedium",
                        value: 3,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.hex_of_tedium.title",
                        descriptionId: "symbols.hex_of_tedium.description",
                        states: {
                            normal: {
                                id: "Symbol_Hex_of_Tedium",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        rariyModCoefs: [{ id: RarityId.UNCOMMON, value: 1 / 1.2 }, { id: RarityId.RARE, value: 1 / 1.2 }, { id: RarityId.EPIC, value: 1 / 1.2 }]
                                    }
                                ]
                            }
                        ]
                    },
                    hex_of_thievery: {
                        id: "hex_of_thievery",
                        value: 3,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.hex_of_thievery.title",
                        descriptionId: "symbols.hex_of_thievery.description",
                        states: {
                            normal: {
                                id: "Symbol_Hex_of_Thievery",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: -6
                                    }
                                ]
                            }
                        ]
                    },
                    highlander: {
                        id: "highlander",
                        value: 6,
                        rarity: RarityId.EPIC,
                        titleId: "symbols.highlander.title",
                        descriptionId: "symbols.highlander.description",
                        states: {
                            normal: {
                                id: "Symbol_Highlander",
                                type: "image"
                            }
                        }
                    },
                    honey: {
                        id: "honey",
                        tags: [GameSymbolTag.FOOD],
                        value: 3,
                        rarity: RarityId.RARE,
                        titleId: "symbols.honey.title",
                        states: {
                            normal: {
                                id: "Symbol_Honey",
                                type: "image"
                            }
                        }
                    },
                    hooligan: {
                        id: "hooligan",
                        tags: [GameSymbolTag.HUMAN],
                        value: 2,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.hooligan.title",
                        descriptionId: "symbols.hooligan.description",
                        states: {
                            normal: {
                                id: "Symbol_Hooligan",
                                type: "image"
                            }
                        },
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolIds: [GameSymbolId.URN, GameSymbolId.BIG_URN, GameSymbolId.TOMB],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 6
                                    },
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        destroying: true
                                    }
                                ]
                            }
                        ]
                    },
                    // hustling_capsule: {
                    //     id: "hustling_capsule",
                    //     value: -7,
                    //     rarity: RarityId.UNCOMMON,
                    //     titleId: "symbols.hustling_capsule.title",
                    //     descriptionId: "symbols.hustling_capsule.description",
                    //     states: {
                    //         normal: {
                    //             id: "Symbol_Hustling_Capsule",
                    //             type: "image"
                    //         }
                    //     }
                    // },
                    // item_capsule: {
                    //     id: "item_capsule",
                    //     value: 0,
                    //     rarity: RarityId.UNCOMMON,
                    //     titleId: "symbols.item_capsule.title",
                    //     descriptionId: "symbols.item_capsule.description",
                    //     states: {
                    //         normal: {
                    //             id: "Symbol_Item_Capsule",
                    //             type: "image"
                    //         }
                    //     }
                    // },
                    jellyfish: {
                        id: "jellyfish",
                        tags: [GameSymbolTag.ANIMAL],
                        value: 2,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.jellyfish.title",
                        descriptionId: "symbols.jellyfish.description",
                        states: {
                            normal: {
                                id: "Symbol_Jellyfish",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_DESTROY,

                                actions: [
                                    {
                                        removesValue: 1
                                    }
                                ]
                            }
                        ]
                    },
                    joker: {
                        id: "joker",
                        tags: [GameSymbolTag.HUMAN],
                        value: 3,
                        rarity: RarityId.EPIC,
                        titleId: "symbols.joker.title",
                        descriptionId: "symbols.joker.description",
                        states: {
                            normal: {
                                id: "Symbol_Joker",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolIds: [GameSymbolId.DIAMONDS, GameSymbolId.HEARTS, GameSymbolId.SPADES, GameSymbolId.CLUBS],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        coef: 3
                                    }
                                ]
                            }
                        ]

                    },
                    key: {
                        id: "key",
                        value: 1,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.key.title",
                        descriptionId: "symbols.key.description",
                        states: {
                            normal: {
                                id: "Symbol_Key",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,
                                symbolIds: [GameSymbolId.LOCKBOX, GameSymbolId.SAFE, GameSymbolId.TREASURE_CHEST, GameSymbolId.MEGA_CHEST],

                                priority: InteractionPrioirities.DESTROY_SELF,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        destroying: true
                                    },
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        destroying: true
                                    }
                                ]
                            }
                        ]
                    },
                    king_midas: {
                        id: "king_midas",
                        tags: [GameSymbolTag.HUMAN],
                        value: 1,
                        rarity: RarityId.RARE,
                        titleId: "symbols.king_midas.title",
                        descriptionId: "symbols.king_midas.description",
                        states: {
                            normal: {
                                id: "Symbol_King_Midas",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolIds: [GameSymbolId.COIN],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        coef: 3
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        symbolIdsToCreate: [GameSymbolId.COIN]
                                    }
                                ]
                            }
                        ]
                    },
                    light_bulb: {
                        id: "light_bulb",
                        value: 1,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.light_bulb.title",
                        descriptionId: "symbols.light_bulb.description",

                        counterVisible: true,
                        counter: 5,
                        // counter: 2,
                        // counter: 1,

                        states: {
                            normal: {
                                id: "Symbol_Light_Bulb",
                                type: "image"
                            }
                        },
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.COUNTER,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.DESTROY_SELF,

                                maxRepeatCount: 1,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        destroying: true
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolTags: [GameSymbolTag.GEM],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        coef: 2
                                    },
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        counter: 1
                                    }
                                ]
                            },

                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.INCREASE_TARGET,
                                symbolIds: [GameSymbolId.AMETHYST],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        permanentValueChange: 1
                                    }
                                ]
                            }
                        ]
                    },
                    lockbox: {
                        id: "lockbox",
                        value: 1,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.lockbox.title",
                        descriptionId: "symbols.lockbox.description",
                        states: {
                            normal: {
                                id: "Symbol_Lockbox",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_DESTROY,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 15
                                    }
                                ]
                            }
                        ]
                    },
                    lucky_capsule: {
                        id: "lucky_capsule",
                        value: 0,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.lucky_capsule.title",
                        descriptionId: "symbols.lucky_capsule.description",
                        states: {
                            normal: {
                                id: "Symbol_Lucky_Capsule",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        nextSpinRequiredRarities: [RarityId.RARE]
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.DESTROY_SELF,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        destroying: true
                                    }
                                ]
                            }
                        ]
                    },
                    magic_key: {
                        id: "magic_key",
                        value: 2,
                        rarity: RarityId.RARE,
                        titleId: "symbols.magic_key.title",
                        descriptionId: "symbols.magic_key.description",
                        states: {
                            normal: {
                                id: "Symbol_Magic_Key",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,
                                symbolIds: [GameSymbolId.LOCKBOX, GameSymbolId.SAFE, GameSymbolId.TREASURE_CHEST, GameSymbolId.MEGA_CHEST],

                                priority: InteractionPrioirities.DESTROY_SELF,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        coef: 3,
                                        destroying: true
                                    },
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        destroying: true
                                    }
                                ]
                            }
                        ]
                    },
                    magpie: {
                        id: "magpie",
                        tags: [GameSymbolTag.ANIMAL],
                        value: -1,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.magpie.title",
                        descriptionId: "symbols.magpie.description",
                        states: {
                            normal: {
                                id: "Symbol_Magpie",
                                type: "image"
                            }
                        },

                        counterVisible: true,
                        counter: 4,
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        counter: 1,
                                        ignoreAnim: true
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.COUNTER,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [{
                                    type: GameSlotSymbolInteractionActionType.SELF,
                                    value: 9
                                }]
                            }
                        ]
                    },
                    martini: {
                        id: "martini",
                        tags: [GameSymbolTag.FOOD],
                        value: 3,
                        rarity: RarityId.RARE,
                        titleId: "symbols.martini.title",
                        states: {
                            normal: {
                                id: "Symbol_Martini",
                                type: "image"
                            }
                        }
                    },
                    matryoshka_doll: {
                        id: "matryoshka_doll",
                        value: 0,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.matryoshka_doll.title",
                        descriptionId: "symbols.matryoshka_doll.description",
                        states: {
                            normal: {
                                id: "Symbol_Matryoshka_Doll",
                                type: "image"
                            }
                        },

                        counterVisible: true,
                        counter: 3,
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ACTIVE_COUNTER,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        counter: 1,
                                        ignoreAnim: true
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.COUNTER,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.DESTROY_SELF,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        destroying: true
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_DESTROY,

                                actions: [
                                    {
                                        symbolIdsToCreate: [GameSymbolId.MATRYOSHKA_DOLL_2]
                                    }
                                ]
                            }
                        ]
                    },
                    matryoshka_doll_2: {
                        id: "matryoshka_doll_2",
                        value: 1,
                        rarity: RarityId.NONE,
                        titleId: "symbols.matryoshka_doll_2.title",
                        descriptionId: "symbols.matryoshka_doll_2.description",
                        states: {
                            normal: {
                                id: "Symbol_Matryoshka_Doll_2",
                                type: "image"
                            }
                        },

                        counterVisible: true,
                        counter: 5,
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ACTIVE_COUNTER,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        counter: 1,
                                        ignoreAnim: true
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.COUNTER,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.DESTROY_SELF,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        destroying: true
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_DESTROY,

                                actions: [
                                    {
                                        symbolIdsToCreate: [GameSymbolId.MATRYOSHKA_DOLL_3]
                                    }
                                ]
                            }
                        ]
                    },
                    matryoshka_doll_3: {
                        id: "matryoshka_doll_3",
                        value: 2,
                        rarity: RarityId.NONE,
                        titleId: "symbols.matryoshka_doll_3.title",
                        descriptionId: "symbols.matryoshka_doll_3.description",
                        states: {
                            normal: {
                                id: "Symbol_Matryoshka_Doll_3",
                                type: "image"
                            }
                        },

                        counterVisible: true,
                        counter: 7,
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ACTIVE_COUNTER,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        counter: 1,
                                        ignoreAnim: true
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.COUNTER,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.DESTROY_SELF,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        destroying: true
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_DESTROY,

                                actions: [
                                    {
                                        symbolIdsToCreate: [GameSymbolId.MATRYOSHKA_DOLL_4]
                                    }
                                ]
                            }
                        ]
                    },
                    matryoshka_doll_4: {
                        id: "matryoshka_doll_4",
                        value: 3,
                        rarity: RarityId.NONE,
                        titleId: "symbols.matryoshka_doll_4.title",
                        descriptionId: "symbols.matryoshka_doll_4.description",
                        states: {
                            normal: {
                                id: "Symbol_Matryoshka_Doll_4",
                                type: "image"
                            }
                        },

                        counterVisible: true,
                        counter: 9,
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ACTIVE_COUNTER,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        counter: 1,
                                        ignoreAnim: true
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.COUNTER,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.DESTROY_SELF,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        destroying: true
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_DESTROY,

                                actions: [
                                    {
                                        symbolIdsToCreate: [GameSymbolId.MATRYOSHKA_DOLL_5]
                                    }
                                ]
                            }
                        ]
                    },
                    matryoshka_doll_5: {
                        id: "matryoshka_doll_5",
                        value: 4,
                        rarity: RarityId.NONE,
                        titleId: "symbols.matryoshka_doll_5.title",
                        states: {
                            normal: {
                                id: "Symbol_Matryoshka_Doll_5",
                                type: "image"
                            }
                        }
                    },
                    mega_chest: {
                        id: "mega_chest",
                        value: 3,
                        rarity: RarityId.EPIC,
                        titleId: "symbols.mega_chest.title",
                        descriptionId: "symbols.mega_chest.description",
                        states: {
                            normal: {
                                id: "Symbol_Mega_Chest",
                                type: "image"
                            }
                        },
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_DESTROY,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 100
                                    }
                                ]
                            }
                        ]
                    },
                    midas_bomb: {
                        id: "midas_bomb",
                        value: 0,
                        rarity: RarityId.EPIC,
                        titleId: "symbols.midas_bomb.title",
                        descriptionId: "symbols.midas_bomb.description",
                        states: {
                            normal: {
                                id: "Symbol_Midas_Bomb",
                                type: "image"
                            }
                        },

                        interactions: [

                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.INCREASE_TARGET,
                                symbolIds: [GameSymbolId.AMETHYST],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        ignoreAnim: true,

                                        permanentValueChange: 1
                                    }
                                ]
                            },

                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.INCREASE_TARGET,
                                symbolIds: [GameSymbolId.PEAR],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        ignoreAnim: true,

                                        permanentValueChange: 1
                                    }
                                ]
                            },

                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        destroying: true,
                                        coef: 7
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.DESTROY_SELF,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        destroying: true
                                    }
                                ]
                            }
                        ]
                    },
                    milk: {
                        id: "milk",
                        tags: [GameSymbolTag.FOOD],
                        value: 1,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.milk.title",
                        states: {
                            normal: {
                                id: "Symbol_Milk",
                                type: "image"
                            }
                        }
                    },
                    mine: {
                        id: "mine",
                        value: 4,
                        rarity: RarityId.RARE,
                        titleId: "symbols.mine.title",
                        descriptionId: "symbols.mine.description",
                        states: {
                            normal: {
                                id: "Symbol_Mine",
                                type: "image"
                            }
                        },

                        counterVisible: true,
                        counter: 5,
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        symbolIdsToCreate: [GameSymbolId.ORE]
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ACTIVE_COUNTER,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        counter: 1,
                                        ignoreAnim: true
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.COUNTER,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.DESTROY_SELF,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        destroying: true
                                    }
                                ]
                            }
                        ]
                    },
                    miner: {
                        id: "miner",
                        tags: [GameSymbolTag.HUMAN],
                        value: 1,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.miner.title",
                        descriptionId: "symbols.miner.description",
                        states: {
                            normal: {
                                id: "Symbol_Miner",
                                type: "image"
                            }
                        },
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolIds: [GameSymbolId.ORE, GameSymbolId.BIG_ORE],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 20
                                    },
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        destroying: true
                                    }
                                ]
                            }
                        ]
                    },
                    missing: {
                        id: "missing",
                        value: 0,
                        rarity: RarityId.NONE,
                        titleId: "symbols.missing.title",
                        states: {
                            normal: {
                                id: "Symbol_Missing",
                                type: "image"
                            }
                        }
                    },
                    monkey: {
                        id: "monkey",
                        tags: [GameSymbolTag.ANIMAL],
                        value: 1,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.monkey.title",
                        descriptionId: "symbols.monkey.description",
                        states: {
                            normal: {
                                id: "Symbol_Monkey",
                                type: "image"
                            }
                        },
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolIds: [GameSymbolId.BANANA, GameSymbolId.COCONUT, GameSymbolId.COCONUT_HALF],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        targetValueCoef: 6
                                    },
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        destroying: true
                                    }
                                ]
                            }
                        ]
                    },
                    moon: {
                        id: "moon",
                        value: 3,
                        rarity: RarityId.RARE,
                        titleId: "symbols.moon.title",
                        descriptionId: "symbols.moon.description",
                        states: {
                            normal: {
                                id: "Symbol_Moon",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolIds: [GameSymbolId.OWL, GameSymbolId.RABBIT, GameSymbolId.WOLF],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        coef: 3
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_DESTROY,

                                actions: [
                                    {
                                        symbolIdsToCreate: [GameSymbolId.CHEESE, GameSymbolId.CHEESE, GameSymbolId.CHEESE]
                                    }
                                ]
                            }
                        ]
                    },
                    mouse: {
                        id: "mouse",
                        tags: [GameSymbolTag.ANIMAL],
                        value: 1,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.mouse.title",
                        descriptionId: "symbols.mouse.description",
                        states: {
                            normal: {
                                id: "Symbol_Mouse",
                                type: "image"
                            }
                        },
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolIds: [GameSymbolId.CHEESE],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 15
                                    },
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        destroying: true
                                    }
                                ]
                            }
                        ]
                    },
                    mrs_fruit: {
                        id: "mrs_fruit",
                        tags: [GameSymbolTag.HUMAN],
                        value: 2,
                        rarity: RarityId.RARE,
                        titleId: "symbols.mrs_fruit.title",
                        descriptionId: "symbols.mrs_fruit.description",
                        states: {
                            normal: {
                                id: "Symbol_Mrs_Fruit",
                                type: "image"
                            }
                        },

                        valueChangeCounterVisible: true,
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolIds: [GameSymbolId.BANANA, GameSymbolId.CHERRY, GameSymbolId.COCONUT, GameSymbolId.COCONUT_HALF, GameSymbolId.ORANGE, GameSymbolId.PEACH],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        permanentValueChange: 1
                                    },
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        destroying: true
                                    }
                                ]
                            }
                        ]
                    },
                    ninja: {
                        id: "ninja",
                        tags: [GameSymbolTag.HUMAN],
                        value: 3,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.ninja.title",
                        descriptionId: "symbols.ninja.description",
                        states: {
                            normal: {
                                id: "Symbol_Ninja",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.SYMBOLS_ON_REELS,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,
                                symbolIds: [GameSymbolId.NINJA],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: -1
                                    }
                                ]
                            }
                        ]
                    },
                    omelette: {
                        id: "omelette",
                        tags: [GameSymbolTag.FOOD],
                        value: 3,
                        rarity: RarityId.RARE,
                        titleId: "symbols.omelette.title",
                        descriptionId: "symbols.omelette.description",
                        states: {
                            normal: {
                                id: "Symbol_Omelette",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolIds: [GameSymbolId.CHEESE, GameSymbolId.EGG, GameSymbolId.MILK, GameSymbolId.GOLDEN_EGG, GameSymbolId.OMELETTE],
                                maxRepeatCount: 1,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 2
                                    }
                                ]
                            }
                        ]
                    },
                    orange: {
                        id: "orange",
                        tags: [GameSymbolTag.FOOD],
                        value: 2,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.orange.title",
                        states: {
                            normal: {
                                id: "Symbol_Orange",
                                type: "image"
                            }
                        }
                    },
                    ore: {
                        id: "ore",
                        value: 1,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.ore.title",
                        descriptionId: "symbols.ore.description",
                        states: {
                            normal: {
                                id: "Symbol_Ore",
                                type: "image"
                            }
                        },
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_DESTROY,

                                actions: [
                                    {
                                        randomSymbolIds: [GameSymbolId.VOID_STONE, GameSymbolId.AMETHYST, GameSymbolId.PEARL, GameSymbolId.SHINY_PEBBLE, GameSymbolId.SAPPHIRE, GameSymbolId.EMERALD, GameSymbolId.RUBY, GameSymbolId.DIAMOND_GEM],
                                        randomSymbolIdsCount: 1,
                                        randomSymbolsUseRarity: true
                                    }
                                ]
                            }
                        ]
                    },
                    owl: {
                        id: "owl",
                        tags: [GameSymbolTag.ANIMAL],
                        value: 1,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.owl.title",
                        descriptionId: "symbols.owl.description",
                        states: {
                            normal: {
                                id: "Symbol_Owl",
                                type: "image"
                            }
                        },

                        counterVisible: true,
                        counter: 3,

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        counter: 1,
                                        ignoreAnim: true
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.COUNTER,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [{
                                    type: GameSlotSymbolInteractionActionType.SELF,
                                    value: 1
                                }]
                            }
                        ]
                    },
                    oyster: {
                        id: "oyster",
                        tags: [GameSymbolTag.ANIMAL],
                        value: 1,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.oyster.title",
                        descriptionId: "symbols.oyster.description",
                        states: {
                            normal: {
                                id: "Symbol_Oyster",
                                type: "image"
                            }
                        },
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.RANDOM,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                random: 0.2,

                                actions: [
                                    {
                                        symbolIdsToCreate: [GameSymbolId.PEARL]
                                    }
                                ]
                            }
                        ]
                    },
                    peach: {
                        id: "peach",
                        tags: [GameSymbolTag.FOOD],
                        value: 2,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.peach.title",
                        descriptionId: "symbols.peach.description",
                        states: {
                            normal: {
                                id: "Symbol_Peach",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_DESTROY,

                                actions: [
                                    {
                                        symbolIdsToCreate: [GameSymbolId.SEED]
                                    }
                                ]
                            }
                        ]
                    },
                    pear: {
                        id: "pear",
                        tags: [GameSymbolTag.FOOD],
                        value: 1,
                        rarity: RarityId.RARE,
                        titleId: "symbols.pear.title",
                        descriptionId: "symbols.pear.description",
                        states: {
                            normal: {
                                id: "Symbol_Pear",
                                type: "image"
                            }
                        },

                        valueChangeCounterVisible: true,
                    },
                    pearl: {
                        id: "pearl",
                        tags: [GameSymbolTag.GEM],
                        value: 1,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.pearl.title",
                        states: {
                            normal: {
                                id: "Symbol_Pearl",
                                type: "image"
                            }
                        }
                    },
                    pinata: {
                        id: "pinata",
                        value: 1,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.pinata.title",
                        descriptionId: "symbols.pinata.description",
                        states: {
                            normal: {
                                id: "Symbol_Pinata",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_DESTROY,

                                actions: [
                                    {
                                        symbolIdsToCreate: [GameSymbolId.CANDY, GameSymbolId.CANDY, GameSymbolId.CANDY, GameSymbolId.CANDY, GameSymbolId.CANDY, GameSymbolId.CANDY, GameSymbolId.CANDY]
                                    }
                                ]
                            }
                        ]
                    },
                    pirate: {
                        id: "pirate",
                        tags: [GameSymbolTag.HUMAN],
                        value: 2,
                        rarity: RarityId.EPIC,
                        titleId: "symbols.pirate.title",
                        descriptionId: "symbols.pirate.description",
                        states: {
                            normal: {
                                id: "Symbol_Pirate",
                                type: "image"
                            }
                        },

                        valueChangeCounterVisible: true,
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolIds: [GameSymbolId.ANCHOR, GameSymbolId.BEER, GameSymbolId.COIN, GameSymbolId.LOCKBOX, GameSymbolId.SAFE, GameSymbolId.ORANGE, GameSymbolId.TREASURE_CHEST, GameSymbolId.MEGA_CHEST],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        permanentValueChange: 1
                                    },
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        destroying: true
                                    }
                                ]
                            }
                        ]
                    },
                    present: {
                        id: "present",
                        value: 0,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.present.title",
                        descriptionId: "symbols.present.description",
                        states: {
                            normal: {
                                id: "Symbol_Present",
                                type: "image"
                            }
                        },

                        counterVisible: true,
                        counter: 12,
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        counter: 1,
                                        ignoreAnim: true
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.COUNTER,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.DESTROY_SELF,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        destroying: true
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_DESTROY,

                                actions: [
                                    {
                                        value: 10
                                    }
                                ]
                            }
                        ]
                    },
                    pufferfish: {
                        id: "pufferfish",
                        tags: [GameSymbolTag.ANIMAL],
                        value: 2,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.pufferfish.title",
                        descriptionId: "symbols.pufferfish.description",
                        states: {
                            normal: {
                                id: "Symbol_Pufferfish",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_DESTROY,

                                actions: [
                                    {
                                        rerollsValue: 1
                                    }
                                ]
                            }
                        ]
                    },
                    rabbit_fluff: {
                        id: "rabbit_fluff",
                        value: 2,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.rabbit_fluff.title",
                        descriptionId: "symbols.rabbit_fluff.description",
                        states: {
                            normal: {
                                id: "Symbol_Rabbit_Fluff",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        ignoreAnim: true,
                                        rariyModCoefs: [{ id: RarityId.UNCOMMON, value: 1.2 }, { id: RarityId.RARE, value: 1.2 }, { id: RarityId.EPIC, value: 1.2 }]
                                    }
                                ]
                            }
                        ]
                    },
                    rabbit: {
                        id: "rabbit",
                        tags: [GameSymbolTag.ANIMAL],
                        value: 1,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.rabbit.title",
                        descriptionId: "symbols.rabbit.description",
                        states: {
                            normal: {
                                id: "Symbol_Rabbit",
                                type: "image"
                            }
                        },

                        valueChangeCounterVisible: true,
                        counterVisible: true,
                        counter: 10,
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ACTIVE_COUNTER,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        counter: 1,
                                        ignoreAnim: true
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.COUNTER,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                maxRepeatCount: 1,

                                actions: [{
                                    type: GameSlotSymbolInteractionActionType.SELF,
                                    permanentValueChange: 1
                                }]
                            }
                        ]
                    },
                    rain: {
                        id: "rain",
                        value: 2,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.rain.title",
                        descriptionId: "symbols.rain.description",
                        states: {
                            normal: {
                                id: "Symbol_Rain",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolIds: [GameSymbolId.FLOWER],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        coef: 3
                                    }
                                ]
                            }
                        ]
                    },
                    removal_capsule: {
                        id: "removal_capsule",
                        value: 0,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.removal_capsule.title",
                        descriptionId: "symbols.removal_capsule.description",
                        states: {
                            normal: {
                                id: "Symbol_Removal_Capsule",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        removesValue: 1
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.DESTROY_SELF,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        destroying: true
                                    }
                                ]
                            }
                        ]
                    },
                    reroll_capsule: {
                        id: "reroll_capsule",
                        value: 0,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.reroll_capsule.title",
                        descriptionId: "symbols.reroll_capsule.description",
                        states: {
                            normal: {
                                id: "Symbol_Reroll_Capsule",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        rerollsValue: 1
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.DESTROY_SELF,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        destroying: true
                                    }
                                ]
                            }
                        ]
                    },
                    robin_hood: {
                        id: "robin_hood",
                        tags: [GameSymbolTag.HUMAN],
                        value: -4,
                        rarity: RarityId.RARE,
                        titleId: "symbols.robin_hood.title",
                        descriptionId: "symbols.robin_hood.description",
                        states: {
                            normal: {
                                id: "Symbol_Robin_Hood",
                                type: "image"
                            }
                        },

                        counterVisible: true,
                        counter: 4,
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        counter: 1,
                                        ignoreAnim: true
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.COUNTER,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 25
                                    }
                                ]
                            },

                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolIds: [GameSymbolId.THIEF, GameSymbolId.BOW_WOODEN, GameSymbolId.BOW_SILVER, GameSymbolId.BOW_GOLDEN],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        value: 3
                                    }
                                ]
                            },

                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolIds: [GameSymbolId.BILLIONAIRE, GameSymbolId.TARGET, GameSymbolId.APPLE],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 15
                                    },
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        destroying: true
                                    }
                                ]
                            }
                        ]
                    },
                    ruby: {
                        id: "ruby",
                        tags: [GameSymbolTag.GEM],
                        value: 3,
                        rarity: RarityId.RARE,
                        titleId: "symbols.ruby.title",
                        descriptionId: "symbols.ruby.description",
                        states: {
                            normal: {
                                id: "Symbol_Ruby",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.SYMBOLS_ON_REELS,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,
                                symbolIds: [GameSymbolId.RUBY],
                                minSymbolsCount: 2,
                                countSelf: true,

                                maxRepeatCount: 1,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 1
                                    }
                                ]
                            }
                        ]
                    },
                    safe: {
                        id: "safe",
                        value: 1,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.safe.title",
                        descriptionId: "symbols.safe.description",
                        states: {
                            normal: {
                                id: "Symbol_Safe",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_DESTROY,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 30
                                    }
                                ]
                            }
                        ]
                    },
                    banknote: {
                        id: "banknote",
                        value: 2,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.banknote.title",
                        descriptionId: "symbols.banknote.description",
                        states: {
                            normal: {
                                id: "Symbol_Banknote",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_DESTROY,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 10
                                    }
                                ]
                            }
                        ]
                    },
                    sapphire: {
                        id: "sapphire",
                        tags: [GameSymbolTag.GEM],
                        value: 2,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.sapphire.title",
                        states: {
                            normal: {
                                id: "Symbol_Sapphire",
                                type: "image"
                            }
                        }
                    },
                    seed: {
                        id: "seed",
                        value: 1,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.seed.title",
                        descriptionId: "symbols.seed.description",
                        states: {
                            normal: {
                                id: "Symbol_Seed",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.RANDOM,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.DESTROY_SELF,

                                random: 0.25,
                                // TEST
                                // random: 1,

                                actions: [
                                    {
                                        randomSymbolIds: [GameSymbolId.VOID_FRUIT, GameSymbolId.BANANA, GameSymbolId.CHERRY, GameSymbolId.COCONUT, GameSymbolId.FLOWER, GameSymbolId.PEAR, GameSymbolId.ORANGE, GameSymbolId.PEACH, GameSymbolId.APPLE, GameSymbolId.STRAWBERRY, GameSymbolId.WATERMELON],
                                        randomSymbolIdsCount: 1,
                                        randomSymbolsUseRarity: true
                                    },
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        destroying: true
                                    }
                                ]
                            }
                        ]
                    },
                    shiny_pebble: {
                        id: "shiny_pebble",
                        tags: [GameSymbolTag.GEM],
                        value: 1,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.shiny_pebble.title",
                        descriptionId: "symbols.shiny_pebble.description",
                        states: {
                            normal: {
                                id: "Symbol_Shiny_Pebble",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        ignoreAnim: true,
                                        rariyModCoefs: [{ id: RarityId.UNCOMMON, value: 1.1 }, { id: RarityId.RARE, value: 1.1 }, { id: RarityId.EPIC, value: 1.1 }]
                                    }
                                ]
                            }
                        ]
                    },
                    sloth: {
                        id: "sloth",
                        tags: [GameSymbolTag.ANIMAL],
                        value: 0,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.sloth.title",
                        descriptionId: "symbols.sloth.description",
                        states: {
                            normal: {
                                id: "Symbol_Sloth",
                                type: "image"
                            }
                        },

                        counterVisible: true,
                        counter: 2,
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        counter: 1,
                                        ignoreAnim: true
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.COUNTER,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [{
                                    type: GameSlotSymbolInteractionActionType.SELF,
                                    value: 4
                                }]
                            }
                        ]
                    },
                    snail: {
                        id: "snail",
                        tags: [GameSymbolTag.ANIMAL],
                        value: 0,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.snail.title",
                        descriptionId: "symbols.snail.description",
                        states: {
                            normal: {
                                id: "Symbol_Snail",
                                type: "image"
                            }
                        },

                        counterVisible: true,
                        counter: 4,
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        counter: 1,
                                        ignoreAnim: true
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.COUNTER,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [{
                                    type: GameSlotSymbolInteractionActionType.SELF,
                                    value: 5
                                }]
                            }
                        ]
                    },
                    spades: {
                        id: "spades",
                        value: 1,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.spades.title",
                        descriptionId: "symbols.spades.description",
                        states: {
                            normal: {
                                id: "Symbol_Cards_Spades",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,
                                symbolIds: [GameSymbolId.SPADES, GameSymbolId.CLUBS],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        value: 1
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.SYMBOLS_ON_REELS,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,
                                symbolIds: [GameSymbolId.SPADES, GameSymbolId.CLUBS, GameSymbolId.DIAMONDS, GameSymbolId.HEARTS],
                                minSymbolsCount: 3,
                                countSelf: true,

                                maxRepeatCount: 1,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 1
                                    }
                                ]
                            }
                        ]
                    },
                    ghost: {
                        id: "ghost",
                        value: 6,
                        rarity: RarityId.RARE,
                        titleId: "symbols.ghost.title",
                        descriptionId: "symbols.ghost.description",
                        states: {
                            normal: {
                                id: "Symbol_Ghost",
                                type: "image"
                            }
                        },

                        counterVisible: true,
                        counter: 4,
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        counter: 1,
                                        ignoreAnim: true
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.COUNTER,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.DESTROY_SELF,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        destroying: true
                                    }
                                ]
                            }
                        ]
                    },
                    strawberry: {
                        id: "strawberry",
                        tags: [GameSymbolTag.FOOD],
                        value: 3,
                        rarity: RarityId.RARE,
                        titleId: "symbols.strawberry.title",
                        descriptionId: "symbols.strawberry.description",
                        states: {
                            normal: {
                                id: "Symbol_Strawberry",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.SYMBOLS_ON_REELS,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolIds: [GameSymbolId.STRAWBERRY],
                                minSymbolsCount: 2,
                                countSelf: true,

                                maxRepeatCount: 1,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 1
                                    }
                                ]
                            }
                        ]
                    },
                    sun: {
                        id: "sun",
                        value: 3,
                        rarity: RarityId.RARE,
                        titleId: "symbols.sun.title",
                        descriptionId: "symbols.sun.description",
                        states: {
                            normal: {
                                id: "Symbol_Sun",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolIds: [GameSymbolId.FLOWER],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        coef: 5
                                    }
                                ]
                            }
                        ]
                    },
                    target: {
                        id: "target",
                        value: 2,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.target.title",
                        descriptionId: "symbols.target.description",
                        states: {
                            normal: {
                                id: "Symbol_Target",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_DESTROY,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 10
                                    }
                                ]
                            }
                        ]
                    },
                    tedium_capsule: {
                        id: "tedium_capsule",
                        value: 5,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.tedium_capsule.title",
                        descriptionId: "symbols.tedium_capsule.description",
                        states: {
                            normal: {
                                id: "Symbol_Tedium_Capsule",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        nextSpinRequiredRarities: [RarityId.COMMON]
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.DESTROY_SELF,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        destroying: true
                                    }
                                ]
                            }
                        ]
                    },
                    thief: {
                        id: "thief",
                        tags: [GameSymbolTag.HUMAN],
                        value: -1,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.thief.title",
                        descriptionId: "symbols.thief.description",

                        valueCounterVisible: true,

                        states: {
                            normal: {
                                id: "Symbol_Thief",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_DESTROY,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        useValueCounter: true
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        valueCounter: 4
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolIds: [GameSymbolId.BANKNOTE],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 10
                                    },
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        destroying: true
                                    }
                                ]
                            }
                        ]
                    },
                    three_sided_die: {
                        id: "three_sided_die",
                        value: 0,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.three_sided_die.title",
                        descriptionId: "symbols.three_sided_die.description",
                        states: {
                            normal: {
                                id: "Symbol_Die_D3_0",
                                type: "image"
                            },
                        },
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        minRandomValue: 1,
                                        maxRandomValue: 3
                                    }
                                ]
                            }
                        ]
                    },
                    // time_capsule: {
                    //     id: "time_capsule",
                    //     value: 0,
                    //     rarity: RarityId.UNCOMMON,
                    //     titleId: "symbols.time_capsule.title",
                    //     descriptionId: "symbols.time_capsule.description",
                    //     states: {
                    //         normal: {
                    //             id: "Symbol_Time_Capsule",
                    //             type: "image"
                    //         }
                    //     }
                    // },
                    toddler: {
                        id: "toddler",
                        tags: [GameSymbolTag.HUMAN],
                        value: 1,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.toddler.title",
                        descriptionId: "symbols.toddler.description",
                        states: {
                            normal: {
                                id: "Symbol_Toddler",
                                type: "image"
                            }
                        },
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolIds: [GameSymbolId.PRESENT, GameSymbolId.CANDY, GameSymbolId.PINATA, GameSymbolId.BUBBLE, GameSymbolId.MILK],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 6
                                    },
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        destroying: true
                                    }
                                ]
                            }
                        ]
                    },
                    tomb: {
                        id: "tomb",
                        value: 3,
                        rarity: RarityId.RARE,
                        titleId: "symbols.tomb.title",
                        descriptionId: "symbols.tomb.description",
                        states: {
                            normal: {
                                id: "Symbol_Tomb",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.RANDOM,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                random: 0.06,
                                // TEST
                                // random: 1,

                                actions: [
                                    {
                                        symbolIdsToCreate: [GameSymbolId.GHOST]
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_DESTROY,

                                actions: [
                                    {
                                        symbolIdsToCreate: [GameSymbolId.GHOST, GameSymbolId.GHOST, GameSymbolId.GHOST, GameSymbolId.GHOST]
                                    }
                                ]
                            }
                        ]
                    },
                    treasure_chest: {
                        id: "treasure_chest",
                        value: 2,
                        rarity: RarityId.RARE,
                        titleId: "symbols.treasure_chest.title",
                        descriptionId: "symbols.treasure_chest.description",
                        states: {
                            normal: {
                                id: "Symbol_Treasure_Chest",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_DESTROY,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 50
                                    }
                                ]
                            }
                        ]
                    },
                    turtle: {
                        id: "turtle",
                        tags: [GameSymbolTag.ANIMAL],
                        value: 0,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.turtle.title",
                        descriptionId: "symbols.turtle.description",
                        states: {
                            normal: {
                                id: "Symbol_Turtle",
                                type: "image"
                            }
                        },

                        counterVisible: true,
                        counter: 3,
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        counter: 1,
                                        ignoreAnim: true
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.COUNTER,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [{
                                    type: GameSlotSymbolInteractionActionType.SELF,
                                    value: 4
                                }]
                            }
                        ]
                    },
                    urn: {
                        id: "urn",
                        value: 1,
                        rarity: RarityId.COMMON,
                        titleId: "symbols.urn.title",
                        descriptionId: "symbols.urn.description",
                        states: {
                            normal: {
                                id: "Symbol_Urn",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_DESTROY,

                                actions: [
                                    {
                                        symbolIdsToCreate: [GameSymbolId.GHOST]
                                    }
                                ]
                            }
                        ]
                    },
                    void_creature: {
                        id: "void_creature",
                        tags: [GameSymbolTag.ANIMAL],
                        value: 0,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.void_creature.title",
                        descriptionId: "symbols.void_creature.description",
                        states: {
                            normal: {
                                id: "Symbol_Void_Creature",
                                type: "image"
                            }
                        },
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolIds: [GameSymbolId.EMPTY],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        value: 1
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.DESTROY_SELF,

                                symbolIds: [GameSymbolId.EMPTY],
                                lessThanOrEqualSymbolsCount: 0,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        destroying: true,
                                        value: 8
                                    }
                                ]
                            }
                        ]
                    },
                    void_fruit: {
                        id: "void_fruit",
                        tags: [GameSymbolTag.FOOD],
                        value: 0,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.void_fruit.title",
                        descriptionId: "symbols.void_fruit.description",
                        states: {
                            normal: {
                                id: "Symbol_Void_Fruit",
                                type: "image"
                            }
                        },
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolIds: [GameSymbolId.EMPTY],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        value: 1
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.DESTROY_SELF,

                                symbolIds: [GameSymbolId.EMPTY],
                                lessThanOrEqualSymbolsCount: 0,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        destroying: true,
                                        value: 8
                                    }
                                ]
                            }
                        ]
                    },
                    void_stone: {
                        id: "void_stone",
                        tags: [GameSymbolTag.GEM],
                        value: 0,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.void_stone.title",
                        descriptionId: "symbols.void_stone.description",
                        states: {
                            normal: {
                                id: "Symbol_Void_Stone",
                                type: "image"
                            }
                        },
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolIds: [GameSymbolId.EMPTY],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        value: 1
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.DESTROY_SELF,

                                symbolIds: [GameSymbolId.EMPTY],
                                lessThanOrEqualSymbolsCount: 0,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        destroying: true,
                                        value: 8
                                    }
                                ]
                            }
                        ]
                    },
                    watermelon: {
                        id: "watermelon",
                        tags: [GameSymbolTag.FOOD],
                        value: 4,
                        rarity: RarityId.EPIC,
                        titleId: "symbols.watermelon.title",
                        descriptionId: "symbols.watermelon.description",
                        states: {
                            normal: {
                                id: "Symbol_Watermelon",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.SYMBOLS_ON_REELS,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,
                                symbolIds: [GameSymbolId.WATERMELON],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 1
                                    }
                                ]
                            }
                        ]
                    },
                    wealthy_capsule: {
                        id: "wealthy_capsule",
                        value: 10,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.wealthy_capsule.title",
                        descriptionId: "symbols.wealthy_capsule.description",
                        states: {
                            normal: {
                                id: "Symbol_Wealthy_Capsule",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.NONE,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                priority: InteractionPrioirities.DESTROY_SELF,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        destroying: true
                                    }
                                ]
                            }
                        ]
                    },
                    // wildcard: {
                    //     id: "wildcard",
                    //     value: 0,
                    //     rarity: RarityId.EPIC,
                    //     titleId: "symbols.wildcard.title",
                    //     descriptionId: "symbols.wildcard.description",
                    //     states: {
                    //         normal: {
                    //             id: "Symbol_Wildcard",
                    //             type: "image"
                    //         }
                    //     }
                    // },
                    wine: {
                        id: "wine",
                        tags: [GameSymbolTag.FOOD],
                        value: 2,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.wine.title",
                        descriptionId: "symbols.wine.description",
                        states: {
                            normal: {
                                id: "Symbol_Wine",
                                type: "image"
                            }
                        },

                        valueChangeCounterVisible: true,
                        counterVisible: true,
                        counter: 8,
                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ACTIVE_COUNTER,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        counter: 1,
                                        ignoreAnim: true
                                    }
                                ]
                            },
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.COUNTER,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                maxRepeatCount: 1,

                                actions: [{
                                    type: GameSlotSymbolInteractionActionType.SELF,
                                    permanentValueChange: 1
                                }]
                            }
                        ]
                    },
                    witch: {
                        id: "witch",
                        tags: [GameSymbolTag.HUMAN],
                        value: 2,
                        rarity: RarityId.RARE,
                        titleId: "symbols.witch.title",
                        descriptionId: "symbols.witch.description",
                        states: {
                            normal: {
                                id: "Symbol_Witch",
                                type: "image"
                            }
                        },

                        interactions: [
                            {
                                conditionType: GameSlotSymbolInteractionConditionType.ADJACENT,
                                triggerType: GameSlotSymbolInteractionTriggerType.ON_REELS,

                                symbolIds: [GameSymbolId.CAT, GameSymbolId.OWL, GameSymbolId.CROW, GameSymbolId.APPLE, GameSymbolId.ELDRITCH_CREATURE, GameSymbolId.GHOST, GameSymbolId.HEX_OF_THIEVERY, GameSymbolId.HEX_OF_DESTRUCTION, GameSymbolId.HEX_OF_DRAINING, GameSymbolId.HEX_OF_MIDAS, GameSymbolId.HEX_OF_TEDIUM],

                                actions: [
                                    {
                                        type: GameSlotSymbolInteractionActionType.SELF,
                                        value: 1
                                    },
                                    {
                                        type: GameSlotSymbolInteractionActionType.TARGET,
                                        coef: 2
                                    }
                                ]
                            }
                        ]
                    },
                    wolf: {
                        id: "wolf",
                        tags: [GameSymbolTag.ANIMAL],
                        value: 2,
                        rarity: RarityId.UNCOMMON,
                        titleId: "symbols.wolf.title",
                        states: {
                            normal: {
                                id: "Symbol_Wolf",
                                type: "image"
                            }
                        }
                    }
                    // } as Record<string, IGameSlotSymbolConfigVO>
                } as { [symbolId: string]: IGameSlotSymbolConfigVO }
            }
        }
    }
};

export type GameSlotReelsModuleState = typeof GameSlotReelsModuleInitialState;