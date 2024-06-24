import { BaseAppManager } from "@flashist/appframework/base/managers/BaseAppManager";
import { appStorage } from "@flashist/appframework/state/AppStateModule";
import {EventListenerHelper, QueueCommand, Command, MatrixTools} from "@flashist/fcore";
import { getInstance } from "@flashist/flibs";
import { SlotReelsSpinBehaviourCommand } from "../../slot-reels/commands/spin/SlotReelsSpinBehaviourCommand";
import { ReelState } from "../../slot-reels/data/ReelState";
import { SlotReelsModuleState } from "../../slot-reels/data/state/SlotReelsModuleState";
import { SlotReelsUserSignal } from "../../slot-reels/events/SlotReelsUserSignal";
import { SlotReelTools } from "../../slot-reels/tools/SlotReelTools";
import { AddSymbolsAfterSpinCommand } from "../commands/add-symbol/AddSymbolsAfterSpinCommand";
import { MissionFailCommand } from "../commands/floors-missions/MissionFailCommand";
import { TemplateWinStateCommand } from "../commands/win/TemplateWinStateCommand";
import { GameLogicModuleState } from "../data/state/GameLogicModuleState";
import { GameLogicTools } from "../tools/GameLogicTools";
import { GameState } from "../data/state/GameState";
import {MissionSuccessCommand} from "../commands/floors-missions/MissionSuccessCommand";
import {SlotTimeoutTools} from "../../slot-tools/SlotTimeoutTools";
import {TimeoutTools} from "@flashist/flibs/timeout/tools/TimeoutTools";
import {GamePageModuleInitialState, GamePageModuleState} from "../../game-page/data/state/GamePageModuleState";


export class SlotGameStateManager extends BaseAppManager {

    // protected slotGameStateModel: SlotGameStateModel;
    // protected slotReelsViewModel: SlotReelsViewModel;
    // protected slotReelsModel: SlotReelsModel;
    // protected uiViewModel: UIViewModel;
    // protected balanceTools: BalanceTools;

    protected curSpinCommand: SlotReelsSpinBehaviourCommand;
    protected isServerResponseReceived: boolean;

    protected curStateEventListenerHelper: EventListenerHelper = new EventListenerHelper(this);

    protected gameState = appStorage().getState<GameLogicModuleState>();
    protected reelsState = appStorage().getState<SlotReelsModuleState>();

    protected slotReelTools: SlotReelTools = getInstance(SlotReelTools);
    protected gameLogicTools: GameLogicTools = getInstance(GameLogicTools);

    // protected construction(...args: any[]): void {
    //     super.construction(...args);

    //     this.slotGameStateModel = getInstance(SlotGameStateModel);
    //     this.slotReelsViewModel = getInstance(SlotReelsViewModel);
    //     this.slotReelsModel = getInstance(SlotReelsModel);
    //     this.uiViewModel = getInstance(UIViewModel);
    //     this.balanceTools = getInstance(BalanceTools);

    //     this.curStateEventListenerHelper = new EventListenerHelper(this);
    // }

    // public destruction(): void {
    //     super.destruction();

    //     this.curStateEventListenerHelper.destruction();
    //     this.curStateEventListenerHelper = null;
    // }

    // // protected addListeners(): void {
    // //     super.addListeners();

    // //     this.eventListenerHelper.addEventListener(
    // //         this.globalDispatcher,
    // //         SlotReelsUserSignal.READY_TO_SPIN,
    // //         this.onUserReadyToSpin
    // //     );

    // protected removeListeners(): void {
    //     super.removeListeners();

    //     this.curStateEventListenerHelper.removeAllListeners();
    // }

    // // ====================
    // // GAME STATES
    // // ====================

    protected exitCurState(): void {
        this.curStateEventListenerHelper.removeAllListeners();
    }

    // // ====================
    // // WAIT USER INPUT
    // // ====================

    public enterWaitUserInputState(): void {
        this.exitCurState();


        appStorage().change<GamePageModuleState>()("gamePage.disableUi", false);

        // this.slotGameStateModel.gameState = SlotGameState.WAIT_USER_INPUT;
        // this.gameState.gameLogic.state = GameState.WAIT_USER_ACTION;
        appStorage().change<GameLogicModuleState>()("gameLogic.dynamic.state", GameState.WAIT_USER_ACTION);

        // const slotStateData: ISlotServerStateVO = getItemsForType<ISlotServerStateVO>(SlotServerStateType)[0];
        // this.uiViewModel.balance = slotStateData.balance;

        this.curStateEventListenerHelper.addEventListener(
            this.globalDispatcher,
            SlotReelsUserSignal.READY_TO_SPIN,
            () => {
                this.enterReelSpinState();
            }
        );
    }

    // // ====================
    // // SPIN BEHAVIOUR
    // // ====================

    public async enterReelSpinState() {
        this.exitCurState();

        appStorage().change<GamePageModuleState>()("gamePage.disableUi", true);

        // this.slotGameStateModel.gameState = SlotGameState.REEL_SPIN;
        appStorage().change<GameLogicModuleState>()("gameLogic.dynamic.state", GameState.SPINNING);

        // this.globalDispatcher.dispatchEvent(SlotGameWinMeterSignal.UPDATE_ROUND_WIN, 0);
        // this.uiViewModel.roundWin = 0;

        this.startSpin();

        this.curStateEventListenerHelper.addEventListener(
            this.globalDispatcher,
            SlotReelsUserSignal.READY_TO_STOP,
            () => {
                this.forceStopSpin();
            }
        );
    }

    protected async startSpin(): Promise<void> {
        // const canSpin: boolean = this.balanceTools.checkIfEnoughBalance(this.uiViewModel.totalBet);
        // if (!canSpin) {
        //     alert("Not enough balance!");
        //     return;
        // }

        if (this.slotReelTools.getAllReelsState() !== ReelState.STOPPED) {
            return;
        }
        this.isServerResponseReceived = false;

        // Visual spin behaviour
        this.curSpinCommand = getInstance(SlotReelsSpinBehaviourCommand);
        this.curSpinCommand.execute()
            .finally(
                () => {
                    this.exitSpinState();
                }
            );

        // Initiate the start spin behaviour
        this.curSpinCommand.startSpin();

        // Take away money from user balance for the spin (even before server responses about it)
        // this.uiViewModel.balance -= this.uiViewModel.totalBet;

        // // Server-side request
        // getInstance(SlotSpinServerCommand, this.uiViewModel.bet, this.uiViewModel.coins)
        //     .execute()
        //     .then(
        //         () => {
        //             this.isServerResponseReceived = true;

        //             // TODO: add delay for regulation markets if we need to make sure the spin took specific amount of time
        //             this.stopSpin();
        //         }
        //     );

        if (IS_DEV) {
            // TEST
            // Randomization of stop positions happens in the prepare-to-start classes,
            // so we can stop at any position we want
            const stopPositions: number[] = [0, 0, 0, 0, 0];
            appStorage().change<SlotReelsModuleState>()("slot.dynamic.stop.positions", stopPositions);
            //
            // DEBUG - show in the console information about the final symbols on the reels
            const serverSymbolIds: string[][] = this.slotReelTools.getReelSymbolIdsFromTapePositions(
                this.reelsState.slot.dynamic.reelSetId,
                stopPositions
            );
            const serverSymbolIdsPerColumn: string[][] = MatrixTools.transpose2dMatrix(serverSymbolIds);
            //
            const label = 'DEBUG';
            console.group(label);
            console.log("DEBUG: STOP SYMBOL IDS");
            console.table(serverSymbolIdsPerColumn);
            console.groupEnd();
            // TEST - END
        }

        this.isServerResponseReceived = true;

        // setTimeout(
        //     () => {
        //         this.stopSpin();
        //     },
        //     500
        // );

        // Adding timeout to make sure there is some time before the rotation stops
        // it's important for improving performance
        await TimeoutTools.asyncTimeout(150);
        this.stopSpin();
    }

    protected exitSpinState(): void {
        // const serverState: ISlotServerStateVO = getItemsForType<ISlotServerStateVO>(SlotServerStateType)[0];
        // const serverRound: ISlotServerRoundVO = getItem<ISlotServerRoundVO>(SlotServerRoundType, serverState.roundId);
        // if (serverRound.isWinning) {
        //     this.enterWinAnimationsState();
        // } else {
        //     this.enterWaitUserInputState();
        // }
        // this.enterWaitUserInputState();

        this.enterWinAnimationState();
    }

    protected stopSpin(): void {
        if (!this.isServerResponseReceived) {
            return;
        }

        this.curSpinCommand.stopSpin(false);
    }

    protected forceStopSpin(): void {
        if (!this.isServerResponseReceived) {
            return;
        }

        this.curSpinCommand.stopSpin(true);
    }


    // // ====================
    // // WIN BEHAVIOUR
    // // ====================

    public async enterWinAnimationState(): Promise<void> {
        this.exitCurState();

        if (this.gameState.gameLogic.dynamic.state === GameState.WIN_ANIMATION) {
            return;
        }
        appStorage().change<GameLogicModuleState>()("gameLogic.dynamic.state", GameState.WIN_ANIMATION);

        // Calculate Wins
        await new TemplateWinStateCommand()
            .execute();

        let missionOver: boolean = false;
        let missionSuccess: boolean = false;
        let missionFailed: boolean = false;
        if (this.gameLogicTools.getSpinsLeftForActiveMission() <= 0) {
            missionOver = true;

            if (this.gameLogicTools.getCoinsLeftForActiveMission() <= 0) {
                missionSuccess = true;
            } else {
                missionFailed = true;
            }
        }

        let finishMissionCommands: Command[] = [];
        if (missionSuccess) {
            if (this.gameLogicTools.getIfLastMission()) {
                // alert("LAST MISSION COMPLETE! CREATE POPUP FOR IT!");
                this.gameLogicTools.generateNewEndlessMission();
            }

            finishMissionCommands.push(new MissionSuccessCommand());

        } else if (missionFailed) {
            finishMissionCommands.push(new MissionFailCommand());
        }

        //
        if (!missionFailed) {
            finishMissionCommands.push(new AddSymbolsAfterSpinCommand());
        }
        // new AddSymbolsAfterSpinCommand()
        //     .execute()
        //     .then(
        //         () => {
        //             this.enterWaitUserInputState();
        //         }
        //     );

        new QueueCommand(finishMissionCommands)
            .execute()
            .then(
                () => {
                    this.enterWaitUserInputState();
                }
            );

        // // TEST - to prevent getting stucked at the transition to the win state
        // // this.enterWaitUserInputState();
        // const winStateCommand: SlotWinStateCommand = getInstance(SlotWinStateCommand);
        // winStateCommand.execute()
        //     .finally(
        //         () => {
        //             this.enterReelSpinState();
        //         }
        //     );

        // this.eventListenerHelper.addEventListener(
        //     this.globalDispatcher,
        //     SlotReelsUserSignal.READY_TO_SPIN,
        //     () => {
        //         winStateCommand.terminate();
        //     }
        // );
    }
}