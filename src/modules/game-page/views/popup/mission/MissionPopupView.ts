import { BaseBtn } from "@flashist/appframework/display/views/button/BaseBtn";
import { Align, AutosizeType, FContainer, FLabel, getInstance, getText, Graphics, Point, Sprite } from "@flashist/flibs";
import { TemplateSettings } from "../../../../../TemplateSettings";
import { IMissionConfigVO } from "../../../../game-logic/data/state/IMissionConfigVO";
import { GamePagePopupView } from "../GamePagePopupView";
import { GamePagePopupConfig } from "../GamePagePopupConfig";
import { BaseLayoutableContainer } from "@flashist/appframework/display/views/layout/container/BaseLayoutableContainer";
import { ColumnLayout } from "@flashist/appframework/display/views/layout/ColumnLayout";
import { GamePagePopupSettings } from "../GamePagePopupSettings";
import { IconWithTextView } from "../../coins/IconWithTextView";
import { AutoScrollPane } from "../../../../../views/scrollable-container/AutoScrollPane";
import { ContainersManager } from "@flashist/appframework/containers/managers/ContainersManager";
import { GameViewId } from "../../GameViewId";
import { SimpleImageButton } from "@flashist/appframework/display/views/button/simple-image-button/SimpleImageButton";
import { PrepareFontId } from "../../../../game-logic/data/PrepareFontId";

export class MissionPopupView extends GamePagePopupView<IMissionConfigVO> {

    protected innerContentCont: BaseLayoutableContainer;
    protected innerContentLayout: ColumnLayout;

    public contentBg: Graphics;

    protected titleLabel: FLabel;

    protected goalCont: FContainer;
    protected dayLabel: FLabel;
    // protected coinsCont: FContainer;
    // protected coinsIcon: Sprite;
    // protected coinsLabel: FLabel;
    protected goalCoinsView: IconWithTextView;

    protected messageScrollableCont: AutoScrollPane;
    protected messageLabel: FLabel;

    public closeBtn: SimpleImageButton;
    // public closeBtn: BaseBtn;

    protected construction(config: GamePagePopupConfig): void {
        super.construction(config);

        this.contentBg = new Graphics();
        this.contentCont.addChild(this.contentBg);

        this.innerContentCont = new BaseLayoutableContainer();
        this.contentCont.addChild(this.innerContentCont);

        this.innerContentLayout = new ColumnLayout({ spacingY: 30, align: Align.CENTER });

        this.titleLabel = new FLabel({
            isBitmap: true,

            fontFamily: PrepareFontId.MAIN_96_WHITE_BLACK_STROKE,
            size: 96,
            bold: true,
            color: TemplateSettings.colors.white,
            autosize: true,
            stroke: 0x000000,
            strokeThickness: 10
        });
        this.innerContentCont.addChild(this.titleLabel);


        this.goalCont = new FContainer();
        this.innerContentCont.addChild(this.goalCont);

        this.dayLabel = new FLabel({
            isBitmap: true,

            fontFamily: PrepareFontId.MAIN_96_WHITE_BLACK_STROKE,
            size: 96,
            bold: true,
            color: TemplateSettings.colors.white,
            autosize: true,
            stroke: 0x000000,
            strokeThickness: 10
        });
        this.goalCont.addChild(this.dayLabel);

        this.goalCoinsView = new IconWithTextView(
            {
                icon: {
                    imageId: "Symbol_Coin",
                    size: new Point(115, 115)
                },
                label: {
                    isBitmap: true,

                    fontFamily: PrepareFontId.MAIN_96_WHITE_BLACK_STROKE,
                    size: 96,
                    bold: true,
                    color: TemplateSettings.colors.white,
                    autosize: true,
                    stroke: 0x000000,
                    strokeThickness: 10
                }
            }
        );
        this.goalCont.addChild(this.goalCoinsView);

        // this.coinsCont = new FContainer();
        // this.goalCont.addChild(this.coinsCont);

        // this.coinsIcon = Sprite.from("Symbol_Coin");
        // this.coinsCont.addChild(this.coinsIcon);
        // //
        // this.coinsIcon.width = 115;
        // this.coinsIcon.scale.set(this.coinsIcon.scale.x);

        // this.coinsLabel = new FLabel({
        //     fontFamily: "NotoSans",
        //     size: 96,
        //     bold: true,
        //     color: TemplateSettings.colors.white,
        //     autosize: true,
        //     stroke: 0x000000,
        //     strokeThickness: 10
        // });
        // this.coinsCont.addChild(this.coinsLabel);

        this.messageScrollableCont = new AutoScrollPane({ autoScroll: true });
        this.innerContentCont.addChild(this.messageScrollableCont);

        this.messageLabel = new FLabel({
            isBitmap: true,

            fontFamily: PrepareFontId.MAIN_96_WHITE_BLACK_STROKE,
            size: 64,
            bold: true,
            color: TemplateSettings.colors.white,
            stroke: 0x000000,
            strokeThickness: 10,

            autosize: true,
            autosizeType: AutosizeType.HEIGHT,
            wordWrap: true
            // maxAutosizeHeight: 1100,
        });
        this.messageScrollableCont.addContent(this.messageLabel);
        // this.innerContentCont.addChild(this.messageLabel);
        //
        this.messageLabel.width = 1070;
        this.messageLabel.wordWrapWidth = this.messageLabel.width;

        this.closeBtn = new SimpleImageButton({
            states: {
                normal: {
                    imageId: "AcceptBtn"
                }
            }
        });
        this.contentCont.addChild(this.closeBtn);
        //
        this.closeBtn.width = 230;
        this.closeBtn.scale.set(this.closeBtn.scale.x);

        //
        const containersManager: ContainersManager = getInstance(ContainersManager);
        containersManager.addContainer(this.goalCont, GameViewId.MISSION_POPUP_GOAL);
        containersManager.addContainer(this.closeBtn, GameViewId.MISSION_POPUP_CLOSE);
    }

    protected commitData(): void {
        super.commitData();

        if (!this.data) {
            return;
        }

        this.titleLabel.text = getText(this.data.texts.title, this.data);

        this.dayLabel.text = getText(this.data.texts.day, this.data);
        this.goalCoinsView.text = getText(this.data.texts.goal, this.data);
        this.messageLabel.text = getText(this.data.texts.message, this.data);

        this.arrange();
    }

    protected arrange(): void {
        super.arrange();

        this.goalCoinsView.y = this.dayLabel.y + this.dayLabel.height - 20;
        this.dayLabel.x = this.goalCoinsView.x + Math.floor((this.goalCoinsView.width - this.dayLabel.width) / 2);

        // Message
        const maxMessageHeight: number = Math.min(1100, this.messageLabel.height);
        this.messageScrollableCont.resize(
            this.messageLabel.width,
            maxMessageHeight
        );

        this.innerContentLayout.arrange(this.innerContentCont);

        // this.contentBg.height = this.innerContentCont.height + 180;

        this.innerContentCont.x = this.contentBg.x + Math.floor((this.contentBg.width - this.innerContentCont.width) / 2);
        // this.innerContentCont.y = this.contentBg.y + Math.floor((this.contentBg.height - this.innerContentCont.height) / 2);
        this.innerContentCont.y = this.contentBg.y + 20;

        this.contentBg.clear();
        //
        // this.contentBg.beginFill(TemplateSettings.colors.lighterGrey, 1);
        this.contentBg.beginFill(TemplateSettings.colors.lightGrey, 1);
        this.contentBg.lineStyle(GamePagePopupSettings.borderWidth, TemplateSettings.colors.black, 1, 0);
        this.contentBg.drawRect(0, 0, GamePagePopupSettings.bgWidth, this.innerContentCont.height + 180);
        //
        let tempY: number;
        //
        // this.contentBg.beginFill(0xFF0000);
        this.contentBg.lineStyle(GamePagePopupSettings.borderWidth, TemplateSettings.colors.black, 1, 0.5);
        //
        tempY = this.innerContentCont.y + (((this.titleLabel.y + this.titleLabel.height) + this.goalCont.y) / 2);
        this.contentBg.drawRect(0, tempY, this.contentBg.width, 0);
        //
        // tempY = this.innerContentCont.y + (((this.goalCont.y + this.goalCont.height) + this.messageLabel.y) / 2);
        tempY = this.innerContentCont.y + (((this.goalCont.y + this.goalCont.height) + this.messageScrollableCont.y) / 2);
        this.contentBg.drawRect(0, tempY, this.contentBg.width, 0);

        this.closeBtn.x = this.contentBg.x + Math.floor((this.contentBg.width - this.closeBtn.width) / 2);
        this.closeBtn.y = this.contentBg.y + this.contentBg.height - Math.floor(this.closeBtn.height / 2);
    }
}