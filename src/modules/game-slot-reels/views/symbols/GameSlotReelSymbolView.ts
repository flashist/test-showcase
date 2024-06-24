import { FContainer, FLabel, getInstance, InteractiveEvent, Point } from "@flashist/flibs";
import { TemplateSettings } from "../../../../TemplateSettings";
import { SlotReelSymbolView } from "../../../slot-reels/views/symbols/SlotReelSymbolView";
import { SlotSymbolViewState } from "../../../slot-symbol-views/data/SlotSymbolViewState";
import { IGameReelSymbolVO } from "../../data/symbols/IGameReelSymbolVO";
import { IGameSlotSymbolCompanionVO } from "../../data/symbols/IGameSlotSymbolCompanionVO";
import { GameSlotReelSymbolTools } from "../../tools/GameSlotReelSymbolTools";
import { GameSlotReelSymbolViewEvent } from "./GameSlotReelSymbolViewEvent";
import { PrepareFontId } from "../../../game-logic/data/PrepareFontId";

export class GameSlotReelSymbolView extends SlotReelSymbolView<IGameReelSymbolVO> {

    protected gameSlotReelSymbolTools: GameSlotReelSymbolTools;

    protected countersCont: FContainer;
    protected counterLabel: FLabel;
    protected valueCounterLabel: FLabel;
    protected valueChangeCounterLabel: FLabel;

    protected prevPreservingState: boolean;

    protected construction(maxSymbolSize: Point): void {
        super.construction(maxSymbolSize);

        this.interactive = true;
        this.buttonMode = true;

        this.gameSlotReelSymbolTools = getInstance(GameSlotReelSymbolTools);

        this.countersCont = new FContainer();
        this.addChild(this.countersCont);

        this.counterLabel = new FLabel(
            // {
            //     fontFamily: "NotoSans",
            //     size: 48,
            //     bold: true,
            //     color: TemplateSettings.colors.white,
            //     stroke: TemplateSettings.colors.black,
            //     strokeThickness: 5,
            //     autosize: true
            // }
            {
                isBitmap: true,

                fontFamily: PrepareFontId.MAIN_48_WHITE_BLACK_STROKE,
                size: 48,
                bold: true,
                color: TemplateSettings.colors.white,
                stroke: TemplateSettings.colors.black,
                strokeThickness: 5,
                autosize: true
            }
        );
        this.countersCont.addChild(this.counterLabel);
        //
        // this.counterLabel.text = "-5";

        this.valueCounterLabel = new FLabel(
            // {
            //     fontFamily: "NotoSans",
            //     size: 48,
            //     bold: true,
            //     color: TemplateSettings.colors.yellow,
            //     stroke: TemplateSettings.colors.black,
            //     strokeThickness: 5,
            //     autosize: true
            // }
            {
                isBitmap: true,

                fontFamily: PrepareFontId.MAIN_48_YELLOW_BLACK_STROKE,
                size: 48,
                bold: true,
                color: TemplateSettings.colors.yellow,
                stroke: TemplateSettings.colors.black,
                strokeThickness: 5,
                autosize: true
            }
        );
        this.countersCont.addChild(this.valueCounterLabel);
        //
        // this.valueCounterLabel.text = "-5";

        this.valueChangeCounterLabel = new FLabel(
            // {
            //     fontFamily: "NotoSans",
            //     size: 48,
            //     bold: true,
            //     color: TemplateSettings.colors.yellow,
            //     stroke: TemplateSettings.colors.black,
            //     strokeThickness: 5,
            //     autosize: true
            // }
            {
                isBitmap: true,

                fontFamily: PrepareFontId.MAIN_48_YELLOW_BLACK_STROKE,
                size: 48,
                bold: true,
                color: TemplateSettings.colors.yellow,
                stroke: TemplateSettings.colors.black,
                strokeThickness: 5,
                autosize: true
            }
        );
        this.countersCont.addChild(this.valueChangeCounterLabel);
        //
        // this.valueChangeCounterLabel.text = "-5";

        // TODO: makes performance suck on mobile, but looks much better.
        // SHOULD TRY TO DO SOMETHING WITH IT!
        // this.filters = [new OutlineFilter(2, TemplateSettings.colors.black, 1)];
    }

    protected addListeners() {
        super.addListeners();

        this.eventListenerHelper.addEventListener(
            this,
            InteractiveEvent.TAP,
            () => {
                // this.globalDispatcher.dispatchEvent(GameSlotReelSymbolViewEvent.TAP, this.reelSymbolCompanionData);
                this.globalDispatcher.dispatchEvent(GameSlotReelSymbolViewEvent.TAP, this.reelSymbolCompanionData);
            }
        )
    }

    public get reelSymbolCompanionData(): IGameSlotSymbolCompanionVO {
        return this.gameSlotReelSymbolTools.getReelSymbolCompanionData(this.data.tapeIndex, this.data.tapePosition);
    }

    protected commitViewStateData(): void {
        super.commitViewStateData();

        if (!this.data) {
            return;
        }

        let shouldShowCounters: boolean = true;
        // if (this.data.willBeDestroyed) {
        //     shouldShowCounters = false;
        // } else
        if (this.data.viewState === SlotSymbolViewState.SPINNING) {
            shouldShowCounters = false;
        }
        this.countersCont.visible = shouldShowCounters;

        if (this.data.willBeDestroyed) {
            this.alpha = 0.5;

        } else {
            this.alpha = 1;
        }

        if (this.data.willBeDestroyed || !this.reelSymbolCompanionData?.counterVisible) {
            this.counterLabel.visible = false;

        } else {
            this.counterLabel.visible = true;
            this.counterLabel.text = this.reelSymbolCompanionData.counterValueToShow.toString();
        }

        if (this.reelSymbolCompanionData?.valueCounterVisible) {
            this.valueCounterLabel.visible = true;
            this.valueCounterLabel.text = this.reelSymbolCompanionData.valueCounterValue.toString();
        } else {
            this.valueCounterLabel.visible = false;
        }

        if (this.reelSymbolCompanionData?.valueChangeCounterVisible) {
            this.valueChangeCounterLabel.visible = true;
            this.valueChangeCounterLabel.text = "+" + this.reelSymbolCompanionData.permanentValueChange.toString();
        } else {
            this.valueChangeCounterLabel.visible = false;
        }

        this.prevPreservingState = this.data.preservingPrevState;
    }

    protected arrange(): void {
        super.arrange();

        const countersPadding: number = 10;
        //
        this.counterLabel.x = countersPadding;
        this.counterLabel.y = countersPadding;
        //
        this.valueCounterLabel.x = this.maxSymbolSize.x - this.valueCounterLabel.width - countersPadding;
        this.valueCounterLabel.y = countersPadding;
        //
        this.valueChangeCounterLabel.x = countersPadding;
        this.valueChangeCounterLabel.y = this.maxSymbolSize.y - this.valueCounterLabel.height - countersPadding;
    }
}