import { BaseAppCommand } from "@flashist/appframework/base/commands/BaseAppCommand";
import { appStorage } from "@flashist/appframework/state/AppStateModule";
import { TimeModuleAppState } from "@flashist/appframework/time/data/state/TimeModuleAppState";
import { TimeManagerEvent } from "@flashist/appframework/time/managers/TimeManagerEvent";
import { QueueCommand } from "@flashist/fcore";
import { getInstance } from "@flashist/flibs";
import { ReelState } from "../../data/ReelState";
import { MovementSequenceType } from "../../data/spin/movement/MovementSequenceType";
import { SlotReelsModuleState } from "../../data/state/SlotReelsModuleState";
import { SlotReelsModuleViewState } from "../../data/state/SlotReelsModuleViewState";
import { IReelSymbolVO } from "../../data/symbols/IReelSymbolVO";
import { ISybmolWithTapePositionVO } from "../../data/symbols/ISymbolWithTapePositionVO";
import { ReelSpinMovementCommandsFactory } from "../../factories/ReelSpinMovementCommandsFactory";
import { SlotReelTools } from "../../tools/SlotReelTools";
import { SlotReelsViewSignal } from "../../views/SlotReelsViewSignal";
import { BaseReelSpinMovementPartCommand } from "./BaseReelSpinMovementPartCommand";

export class SlotReelsSpinBehaviourCommand extends BaseAppCommand {
    // protected timeModel: TimeModel = getInstance(TimeModel);
    // protected reelsModel: SlotReelsModel = getInstance(SlotReelsModel);
    // protected reelsViewModel: SlotReelsViewModel = getInstance(SlotReelsViewModel);

    protected reelTools: SlotReelTools = getInstance(SlotReelTools);
    protected reelCommandsFactory: ReelSpinMovementCommandsFactory = getInstance(ReelSpinMovementCommandsFactory);

    protected reelsState = appStorage().getState<SlotReelsModuleState>();
    protected reelsViewState = appStorage().getState<SlotReelsModuleViewState>();
    protected timeState = appStorage().getState<TimeModuleAppState>();

    protected curSpinQueueCommands: QueueCommand[];
    protected curSpinPromisses: Promise<any>[];

    protected isStopping: boolean;
    protected isForceStopping: boolean;

    protected executeInternal(): void {
        this.curSpinQueueCommands = [];
        this.curSpinPromisses = [];

        //
        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            TimeManagerEvent.UPDATE,
            this.onTimeChange
        );
    }

    protected terminateCurSpinCommands(): Promise<any> {
        if (this.curSpinQueueCommands) {
            for (let singleCurSpinCmd of this.curSpinQueueCommands) {
                singleCurSpinCmd.terminate();
            }
        }

        return new Promise(
            (resolve: Function) => {
                Promise.all(this.curSpinPromisses)
                    .finally(
                        () => {
                            this.curSpinQueueCommands = [];
                            this.curSpinPromisses = [];

                            resolve();
                        }
                    );
            }
        );
    }

    public startSpin(): void {
        for (let singleReelData of this.reelsState.slot.dynamic.reels) {
            const tempCommands: BaseReelSpinMovementPartCommand[] = this.reelCommandsFactory.prepareSpinMovementCommands(MovementSequenceType.START, singleReelData.index);
            const startQueueCommand: QueueCommand = new QueueCommand(tempCommands);
            startQueueCommand.isNeedAbortOnQueueCommandError = true;

            this.curSpinQueueCommands.push(startQueueCommand);
            this.curSpinPromisses.push(
                startQueueCommand.execute()
            );
        }
    }

    public stopSpin(force: boolean): void {
        // Don't trigger the stop behaviour if it has laready been triggered or if the new stop behaviour is not force
        if (this.isStopping && this.isForceStopping) {
            return;
        } else if (this.isStopping && !force) {
            return;
        }
        this.isStopping = true;
        this.isForceStopping = force;

        this.terminateCurSpinCommands()
            .then(
                () => {
                    let stopSequenceType: string = MovementSequenceType.STOP;
                    if (force) {
                        stopSequenceType = MovementSequenceType.STOP_FORCE;
                    }

                    // Prepare stopping commands and execute them
                    // for (let singleReelData of this.reelsModel.reelsData) {
                    for (let singleReelData of this.reelsState.slot.dynamic.reels) {
                        // Start stopping behavior only if reel is not stopped already
                        if (singleReelData.state !== ReelState.STOPPED) {
                            const tempCommands: BaseReelSpinMovementPartCommand[] = this.reelCommandsFactory.prepareSpinMovementCommands(stopSequenceType, singleReelData.index);
                            const stopQueueCommand: QueueCommand = new QueueCommand(tempCommands);
                            stopQueueCommand.isNeedAbortOnQueueCommandError = true;
                            this.curSpinQueueCommands.push(stopQueueCommand);

                            this.curSpinPromisses.push(
                                stopQueueCommand.execute()
                            );
                        }
                    }

                    Promise.all(this.curSpinPromisses)
                        .then(
                            () => {
                                this.processTimeChange();
                                this.notifyComplete();
                            }
                        );
                }
            );
    }


    // ====================
    // Methods used for all spin-behavior parts (in prarallel with other spin behaviour)
    // ====================

    protected onTimeChange(): void {
        this.processTimeChange();
    }

    protected processTimeChange(): void {
        this.changeReelPositionsBasedOnSpeed();
        this.updateReelSymbols();
    }

    protected changeReelPositionsBasedOnSpeed(): void {
        // for (let singleReelData of this.reelsModel.reelsData) {
        for (let singleReelData of this.reelsState.slot.dynamic.reels) {
            if (singleReelData.speedMovementActive) {
                const positionChange: number = singleReelData.speed * this.timeState.time.lastTimeDeltaSec;
                // singleReelData.position += positionChange;

                const newPosition: number = singleReelData.position + positionChange;
                appStorage().change<SlotReelsModuleState>()(`slot.dynamic.reels.${singleReelData.index}.position`, newPosition);
            }
        }

        this.globalDispatcher.dispatchEvent(SlotReelsViewSignal.UPDATE_POSITION);
    }

    protected updateReelSymbols(): void {
        // for (let singleReelData of this.reelsModel.reelsData) {
        for (let singleReelData of this.reelsState.slot.dynamic.reels) {
            this.updateSingleReelSymbols(singleReelData.index);
        }

        this.globalDispatcher.dispatchEvent(SlotReelsViewSignal.RENDER_SYMBOLS);
    }

    protected updateSingleReelSymbols(reelIndex: number): void {
        // const singleReelData = this.reelsModel.reelsData[reelIndex];
        const singleReelData = this.reelsState.slot.dynamic.reels[reelIndex];

        const curPosition: number = this.reelTools.reelPositionRoundMethod(singleReelData.position);
        if (curPosition === this.reelsViewState.slotView.lastProcessedReelViewPositions[singleReelData.index]) {
            return;
        }
        const prevPosition: number = this.reelsViewState.slotView.lastProcessedReelViewPositions[singleReelData.index];
        // this.reelsViewModel.lastProcessedReelViewPositions[singleReelData.index] = curPosition;
        appStorage().change<SlotReelsModuleViewState>()(`slotView.lastProcessedReelViewPositions.${singleReelData.index}`, curPosition);

        const spinDelta: number = curPosition - prevPosition;

        const symbols: ISybmolWithTapePositionVO[] = this.reelsViewState.slotView.extendedReelSymbolsData[reelIndex].map(
            (item: IReelSymbolVO) => {
                return {
                    id: item.id,
                    tapeIndex: item.tapeIndex,
                    tapePosition: item.tapePosition,
                    preservingPrevState: item.preservingPrevState
                };
            }
        );
        this.reelTools.setSingleReelSymbolsBasedOnPositionPreservingPreviousVisibleSymbols(reelIndex, singleReelData.position, spinDelta, symbols);
    }

}