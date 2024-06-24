import { GameSymbolId } from "../symbols/GameSymbolId";
import { IReelSymbolPositionVO } from "../../../slot-reels/data/symbols/IReelSymbolPositionVO";
import { GameSlotSymbolInteractionTriggerType } from "./GameSlotSymbolInteractionTriggerType";
import { GameSlotSymbolInteractionConditionType } from "./GameSlotSymbolInteractionConditionType";
import { IGameSlotSymbolInteractionActionVO } from "./IGameSlotSymbolInteractionActionVO";
import { GameSymbolTag } from "../symbols/GameSymbolTag";

export interface IGameSlotSymbolInteractionConfigVO {

    triggerType: GameSlotSymbolInteractionTriggerType;
    conditionType?: GameSlotSymbolInteractionConditionType,
    priority?: number;

    // actionType: GameSlotSymbolInteractionActionType,

    actions: IGameSlotSymbolInteractionActionVO[];

    // counterChange?: number;
    // counter?: number;
    // 0 <= x < 1 - to use as a number to compare with Math.random() to check if interaction should be triggered or not
    random?: number;

    // valueCounter?: number;

    positions?: IReelSymbolPositionVO[];

    symbolIds?: string[];
    ignoreSymbolIds?: string[];

    symbolTags?: GameSymbolTag[];
    minSymbolsCount?: number;
    maxSymbolsCount?: number;
    lessThanOrEqualSymbolsCount?: number;

    countSelf?: boolean;

    targetRandomToTrigger?: number;

    shouldBeSameX?: boolean;
    shouldBeSameY?: boolean;

    maxRepeatCount?: number;

    useLastRandomNumber?: boolean;

    findRandomAdjacent?: boolean;
}