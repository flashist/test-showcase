import {Align, VAlign} from "@flashist/flibs";

export interface ITutorialStepConfigVO {
    id: string;
    completeSaveStepId?: string;

    textId?: string;
    viewId: string;
    requiredCompleteStepIds?: string[];
    blocking?: boolean;

    align?: Align;
    valign?: VAlign;

    labelAlign?: Align;
    labelValign?: VAlign;

    minTimeToDisplayMs?: number;
}