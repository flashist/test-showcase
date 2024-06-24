import { ISlotSymbolConfigVO } from "../../../slot-symbol-views/data/ISlotSymbolConfigVO";
import { ISingleReelVO } from "../ISingleReelVO";
import { DefaultSlotReelSetId } from "../reels/DefaultSlotReelSetId";
import { IReelSpinConfig } from "../spin/IReelSpinConfig";

export const SlotReelsModuleInitialState = {
    slot: {
        dynamic: {
            reelSetId: DefaultSlotReelSetId as string,
            reels: [] as ISingleReelVO[],
            stop: {
                positions: [0, 0, 0, 0, 0] as number[]
            },
            reelSets: {
                [DefaultSlotReelSetId]: {
                    reels: [] as string[][]
                }
            },

            // I can't set correcty typings here, becase compiler gets stuck in deep-typings inferring
            // The correct typings is SlotReelSymbolView[]
            symbolViews: []
        },

        static: {

            colsCount: 5 as number,
            rowsCount: 4 as number,
            additionalVisibleSymbolsCount: 1 as number,

            symbols: {
                size: { x: 230, y: 230 },
                gap: 0,
                zSortEnabled: true as boolean,

                defaultConfig: {} as Partial<ISlotSymbolConfigVO>,
                configs: {} as Record<string, ISlotSymbolConfigVO>
            },
            spin: {
                sequences: {
                    start: {
                        type: "start",
                        parts: [
                            {
                                type: "state",
                                subType: "change",
                                state: "spinning",
                                symbolsViewState: "spinning"
                            },
                            {
                                type: "delay",
                                subType: "reelBased",
                                duration: 0
                            },
                            {
                                type: "speed",
                                subType: "acceleration",
                                speed: -25,
                                duration: 250,
                                // ease: "back.in"
                                ease: "circ.out"
                            },
                            {
                                type: "speed",
                                subType: "constant",
                                speed: -25,
                                duration: -1
                            } as any
                        ]
                    },
                    stop: {
                        type: "stop",
                        parts: [
                            // {
                            //     type: "delay",
                            //     subType: "reelBased",
                            //     duration: 100
                            // },
                            {
                                type: "prepare",
                                subType: "toStop",
                                duration: "topDown"
                            },
                            {
                                type: "speed",
                                subType: "stop",
                                speed: -25,
                                positionShift: -0.25
                            },
                            {
                                type: "state",
                                subType: "change",
                                state: "finalStopping"
                            },
                            {
                                type: "position",
                                subType: "stop",
                                ease: "power1.out",
                                duration: 100,
                                symbolsViewState: "stopping"
                            },
                            {
                                type: "speed",
                                subType: "constant",
                                speed: 0,
                                duration: 0
                            },
                            {
                                type: "symbols",
                                subType: "waitReelSymbolAnimationsToComplete"
                            },
                            {
                                type: "state",
                                subType: "change",
                                state: "stopped",
                                symbolsViewState: "normal"
                            }
                        ]
                    },
                    stopForce: {
                        type: "stopForce",
                        parts: [
                            {
                                type: "state",
                                subType: "change",
                                state: "finalStopping"
                            },
                            {
                                type: "prepare",
                                subType: "toStop",
                                duration: "topDown"
                            },
                            {
                                type: "position",
                                subType: "stop",
                                positionShift: -0.2,
                                duration: 0
                            },
                            {
                                type: "position",
                                subType: "stop",
                                ease: "power1.out",
                                duration: 100,
                                symbolsViewState: "stopping"
                            },
                            {
                                type: "speed",
                                subType: "constant",
                                speed: 0,
                                duration: 0
                            },
                            {
                                type: "symbols",
                                subType: "waitReelSymbolAnimationsToComplete"
                            },
                            {
                                type: "state",
                                subType: "change",
                                state: "stopped",
                                symbolsViewState: "normal"
                            }
                        ]
                    }
                }
            } as IReelSpinConfig
        }

    }
};

export type SlotReelsModuleState = typeof SlotReelsModuleInitialState;