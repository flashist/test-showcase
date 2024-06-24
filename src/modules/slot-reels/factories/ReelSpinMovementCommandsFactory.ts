import { appStorage } from "@flashist/appframework/state/AppStateModule";
import { IConstructor } from "@flashist/fcore";
import { BaseReelSpinMovementPartCommand } from "../commands/spin/BaseReelSpinMovementPartCommand";
import { ReelSpinDelayReelBasedMovementCommand } from "../commands/spin/delay/ReelSpinDelayReelBasedMovementCommand";
import { ReelSpinPositionStopMovementCommand } from "../commands/spin/position/ReelSpinPositionStopMovementCommand";
import { ReelSpinPositionTargetMovementCommand } from "../commands/spin/position/ReelSpinPositionTargetMovementCommand";
import { PrepareToStopMovementCommand } from "../commands/spin/prepare/PrepareToStopMovementCommand";
import { ReelSpinSpeedAccelerationMovementCommand } from "../commands/spin/speed/ReelSpinSpeedAccelerationMovementCommand";
import { ReelSpinSpeedConstantMovementCommand } from "../commands/spin/speed/ReelSpinSpeedConstantMovementCommand";
import { ReelSpinSpeedStopConstantMovementCommand } from "../commands/spin/speed/ReelSpinSpeedStopConstantMovementCommand";
import { ReelStateChangeMovementCommand } from "../commands/spin/state/ReelStateChangeMovementCommand";
import { ReelWaitAllSymbolsToCompleteAnimationsCommand } from "../commands/spin/symbols/ReelWaitAllSymbolsToCompleteAnimationsCommand";
import { DelaySpinMovementType } from "../data/spin/movement/delay/DelaySpinMovementType";
import { PositionSpinMovementType } from "../data/spin/movement/position/PositionSpinMovementType";
import { PrepareSpinMovementType } from "../data/spin/movement/prepare/PrepareSpinMovementType";
import { SpeedSpinMovementType } from "../data/spin/movement/speed/SpeedSpinMovementType";
import { SpinMovementPartType } from "../data/spin/movement/SpinMovementPartType";
import { StateSpinMovementType } from "../data/spin/movement/state/StateSpinMovementType";
import { SymbolsSpinMovementType } from "../data/spin/movement/symbols/SymbolsSpinMovementType";
import { SlotReelsModuleState } from "../data/state/SlotReelsModuleState";

export class ReelSpinMovementCommandsFactory {

    protected spinMovementTypeToCommandClassMap = (() => {
        const result = {};
        // Position
        result[SpinMovementPartType.POSITION] = {};
        result[SpinMovementPartType.POSITION][PositionSpinMovementType.TARGET] = ReelSpinPositionTargetMovementCommand;
        result[SpinMovementPartType.POSITION][PositionSpinMovementType.STOP] = ReelSpinPositionStopMovementCommand;
        // Speed
        result[SpinMovementPartType.SPEED] = {};
        result[SpinMovementPartType.SPEED][SpeedSpinMovementType.ACCELERATION] = ReelSpinSpeedAccelerationMovementCommand;
        result[SpinMovementPartType.SPEED][SpeedSpinMovementType.CONSTANT] = ReelSpinSpeedConstantMovementCommand;
        result[SpinMovementPartType.SPEED][SpeedSpinMovementType.STOP] = ReelSpinSpeedStopConstantMovementCommand;
        // Delay
        result[SpinMovementPartType.DELAY] = {};
        result[SpinMovementPartType.DELAY][DelaySpinMovementType.REEL_BASED] = ReelSpinDelayReelBasedMovementCommand;
        // Prepare
        result[SpinMovementPartType.PREPARE] = {};
        result[SpinMovementPartType.PREPARE][PrepareSpinMovementType.TO_STOP] = PrepareToStopMovementCommand;
        // State
        result[SpinMovementPartType.STATE] = {};
        result[SpinMovementPartType.STATE][StateSpinMovementType.CHANGE] = ReelStateChangeMovementCommand;
        // Symbols
        result[SpinMovementPartType.SYMBOLS] = {};
        result[SpinMovementPartType.SYMBOLS][SymbolsSpinMovementType.WAIT_REEL_SYBMOL_ANIMATIONS_TO_COMPLETE] = ReelWaitAllSymbolsToCompleteAnimationsCommand;

        return result;
    })();

    public prepareSpinMovementCommands(movementType: string, reelIndex: number): BaseReelSpinMovementPartCommand[] {
        const result: BaseReelSpinMovementPartCommand[] = [];

        // const reelsModel: SlotReelsModel = getInstance(SlotReelsModel);
        // const reelData: ISingleReelVO = reelsModel.reelsData[reelIndex];
        const reelsState = appStorage().getState<SlotReelsModuleState>();
        // const reelData: ISingleReelVO = reelsState.reels[reelIndex];

        // const reelSpinConfig: IReelSpinConfig = getItemsForType<IReelSpinConfig>(ReelSpinConfigType)[0];
        const movementSequenceConfigVO = reelsState.slot.static.spin.sequences[movementType];
        const movementParts = movementSequenceConfigVO.parts;
        for (let singleMovementPart of movementParts) {
            let CommandClass: IConstructor<BaseReelSpinMovementPartCommand>;
            CommandClass = this.spinMovementTypeToCommandClassMap[singleMovementPart.type][singleMovementPart.subType];

            const tempCmd = new CommandClass(singleMovementPart, reelIndex);
            result.push(tempCmd);
        }

        return result;
    }
}