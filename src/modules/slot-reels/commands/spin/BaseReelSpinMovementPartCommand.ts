import gsap from "gsap";

import { getInstance } from "@flashist/flibs";
import { ISingleReelVO } from "../../data/ISingleReelVO";
import { ISpinMovementConfigVO } from "../../data/spin/movement/ISpinMovementConfigVO";
import { SlotReelTools } from "../../tools/SlotReelTools";
import { BaseAppCommand } from "@flashist/appframework/base/commands/BaseAppCommand";
import { SlotTimeoutTools } from "../../../slot-tools/SlotTimeoutTools";
import { appStorage } from "@flashist/appframework/state/AppStateModule";
import { DeepReadonly } from "@flashist/appframework/state/data/DeepReadableTypings";
import { ObjectTools } from "@flashist/fcore";
import { SlotReelsModuleState } from "../../data/state/SlotReelsModuleState";
import { IChangeWrapper } from "@flashist/appframework/state/data/IChangeWrapper";

export abstract class BaseReelSpinMovementPartCommand extends BaseAppCommand {
    protected reelTools: SlotReelTools = getInstance(SlotReelTools);
    protected reelsState: DeepReadonly<SlotReelsModuleState> = appStorage().getState<SlotReelsModuleState>();

    protected tweenAnimations: gsap.core.Tween[] = [];
    protected timeouts: any[] = [];

    // protected reelDataCopy: Readonly<ISingleReelVO>;
    protected reelDataChangeWrapper: IChangeWrapper<ISingleReelVO>;

    // constructor(protected spinMovementConfig: ISpinMovementConfigVO, protected reelData: ISingleReelVO) {
    constructor(protected spinMovementConfig: ISpinMovementConfigVO, protected reelIndex: number) {
        super();
    }

    public get reelData(): DeepReadonly<ISingleReelVO> {
        return appStorage().getState<SlotReelsModuleState>().slot.dynamic.reels[this.reelIndex];
    }

    protected executeInternal(): void {
        // this.reelDataCopy = ObjectTools.clone(this.reelsState.slot.dynamic.reels[this.reelIndex]);
        this.reelDataChangeWrapper = appStorage().changePropertyWrapper<SlotReelsModuleState>()(`slot.dynamic.reels.${this.reelIndex}`);

        if (this.spinMovementConfig.symbolsViewState) {
            this.reelTools.changeReelSymbolViewState(this.reelIndex, this.spinMovementConfig.symbolsViewState);
        }
    }

    protected notifyComplete(...args: any[]): void {
        super.notifyComplete(...args);

        for (let singleTimeout of this.timeouts) {
            SlotTimeoutTools.clearById(singleTimeout);
        }
        this.timeouts = [];

        for (let singleTween of this.tweenAnimations) {
            singleTween.kill();
        }
        this.tweenAnimations = [];
    }

    // protected applyReelDataChanges(): void {
    //     appStorage().change<SlotReelsModuleState>()(`reels.${this.reelIndex}`, this.reelDataCopy);
    // }
    // protected changeReelData<ValueType>(value: ValueType, deepKey: DeepKeyType, value: Partial<ValueType>)
}