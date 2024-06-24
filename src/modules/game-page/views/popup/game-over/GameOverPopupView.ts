import { BaseBtn } from "@flashist/appframework/display/views/button/BaseBtn";
import { ColumnLayout } from "@flashist/appframework/display/views/layout/ColumnLayout";
import { BaseLayoutableContainer } from "@flashist/appframework/display/views/layout/container/BaseLayoutableContainer";
import { Align, AutosizeType, FLabel, getText, Graphics, Sprite } from "@flashist/flibs";
import { TemplateSettings } from "../../../../../TemplateSettings";
import { ScrollPane } from "../../../../../views/scrollable-container/ScrollPane";
import { IMissionConfigVO } from "../../../../game-logic/data/state/IMissionConfigVO";
import { GamePagePopupConfig } from "../GamePagePopupConfig";
import { GamePagePopupSettings } from "../GamePagePopupSettings";
import { GamePagePopupView } from "../GamePagePopupView";
import {AutoScrollPane} from "../../../../../views/scrollable-container/AutoScrollPane";

export class GameOverPopupView extends GamePagePopupView<IMissionConfigVO> {

    protected innerContentCont: BaseLayoutableContainer;
    protected innerContentLayout: ColumnLayout;

    public contentBg: Graphics;

    protected titleLabel: FLabel;

    protected dayLabel: FLabel;

    protected messageScrollableCont: AutoScrollPane;
    protected messageLabel: FLabel;

    protected closeBtnImage: Sprite;
    public closeBtn: BaseBtn;

    protected construction(config: GamePagePopupConfig): void {
        super.construction(config);

        this.contentBg = new Graphics();
        this.contentCont.addChild(this.contentBg);

        this.innerContentCont = new BaseLayoutableContainer();
        this.contentCont.addChild(this.innerContentCont);

        this.innerContentLayout = new ColumnLayout({ spacingY: 30, align: Align.CENTER });

        this.titleLabel = new FLabel({
            fontFamily: TemplateSettings.fonts.mainFont,
            size: 96,
            bold: true,
            color: TemplateSettings.colors.white,
            autosize: true,
            stroke: 0x000000,
            strokeThickness: 10
        });
        this.innerContentCont.addChild(this.titleLabel);

        this.dayLabel = new FLabel({
            fontFamily: TemplateSettings.fonts.mainFont,
            size: 96,
            bold: true,
            color: TemplateSettings.colors.white,
            autosize: true,
            stroke: 0x000000,
            strokeThickness: 10
        });
        this.innerContentCont.addChild(this.dayLabel);

        this.messageScrollableCont = new AutoScrollPane({autoScroll: true});
        this.innerContentCont.addChild(this.messageScrollableCont);

        this.messageLabel = new FLabel({
            fontFamily: TemplateSettings.fonts.mainFont,
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

        this.closeBtnImage = Sprite.from("AcceptBtn");
        this.contentCont.addChild(this.closeBtnImage);
        //
        this.closeBtnImage.width = 230;
        this.closeBtnImage.scale.set(this.closeBtnImage.scale.x);

        this.closeBtn = new BaseBtn();
        this.closeBtn.hitArea = this.closeBtnImage;
    }

    protected commitData(): void {
        super.commitData();

        if (!this.data) {
            return;
        }

        this.titleLabel.text = getText("gamePage.gameOverPopup.title", this.data);

        this.dayLabel.text = getText("gamePage.gameOverPopup.day", this.data);
        this.messageLabel.text = getText("gamePage.gameOverPopup.message", this.data);

        this.arrange();
    }

    protected arrange(): void {
        super.arrange();

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
        this.contentBg.beginFill(TemplateSettings.colors.darkGrey, 1);
        this.contentBg.lineStyle(GamePagePopupSettings.borderWidth, TemplateSettings.colors.black, 1, 0);
        this.contentBg.drawRect(0, 0, GamePagePopupSettings.bgWidth, this.innerContentCont.height + 180);
        //
        let tempY: number;
        //
        // this.contentBg.beginFill(0xFF0000);
        this.contentBg.lineStyle(GamePagePopupSettings.borderWidth, TemplateSettings.colors.black, 1, 0.5);
        //
        tempY = this.innerContentCont.y + (((this.titleLabel.y + this.titleLabel.height) + this.dayLabel.y) / 2);
        this.contentBg.drawRect(0, tempY, this.contentBg.width, 0);
        //
        // tempY = this.innerContentCont.y + (((this.goalCont.y + this.goalCont.height) + this.messageLabel.y) / 2);
        tempY = this.innerContentCont.y + (((this.dayLabel.y + this.dayLabel.height) + this.messageScrollableCont.y) / 2);
        this.contentBg.drawRect(0, tempY, this.contentBg.width, 0);

        this.closeBtnImage.x = this.contentBg.x + Math.floor((this.contentBg.width - this.closeBtnImage.width) / 2);
        this.closeBtnImage.y = this.contentBg.y + this.contentBg.height - Math.floor(this.closeBtnImage.height / 2);
    }

}