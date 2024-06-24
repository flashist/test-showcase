import { appStorage } from "@flashist/appframework/state/AppStateModule";
import { SlotReelsSpinBehaviourCommand } from "../../../slot-reels/commands/spin/SlotReelsSpinBehaviourCommand";
import { GameLogicModuleState } from "../../data/state/GameLogicModuleState";
import { PrepareReelSetForSpinCommand } from "./PrepareReelSetForSpinCommand";
import {TimeoutTools} from "@flashist/flibs/timeout/tools/TimeoutTools";

export class TemplateSlotReelsSpinBehaviourCommand extends SlotReelsSpinBehaviourCommand {

    protected gameLogicState = appStorage().getState<GameLogicModuleState>()

    public async startSpin(): Promise<void> {
        await new PrepareReelSetForSpinCommand()
            .execute();

        const newCoins: number = this.gameLogicState.gameLogic.dynamic.coins - 1;
        appStorage().change<GameLogicModuleState>()("gameLogic.dynamic.coins", newCoins);

        const newMissionSpins: number = this.gameLogicState.gameLogic.dynamic.missionSpins + 1;
        appStorage().change<GameLogicModuleState>()("gameLogic.dynamic.missionSpins", newMissionSpins);

        // Adding timeout to make sure nothing affects smoothness of spin rotation
        // in this frame
        await TimeoutTools.asyncTimeout(0);

        super.startSpin();
    }
}