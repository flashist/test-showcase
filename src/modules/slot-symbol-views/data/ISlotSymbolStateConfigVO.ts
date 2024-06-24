import { IGenericObjectVO } from "@flashist/flibs";

export interface ISlotSymbolStateConfigVO extends IGenericObjectVO {
    id: string;

    type: string;
    animId?: string;

    containerId?: string;

    // State the symbol should be switched into after completing the current state
    // (usually completing the animation of the current state)
    nextStateId?: string;
}