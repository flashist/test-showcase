import {
    Align,
    AutosizeType,
    DisplayResizeTools,
    FContainer,
    FLabel,
    getText,
    Graphics,
    GraphicsTools,
    VAlign
} from "@flashist/flibs";
import { TemplateSettings } from "../../../../../TemplateSettings";
import { GamePagePopupView } from "../GamePagePopupView";
import { GamePagePopupConfig } from "../GamePagePopupConfig";
import { BaseLayoutableContainer } from "@flashist/appframework/display/views/layout/container/BaseLayoutableContainer";
import { ColumnLayout } from "@flashist/appframework/display/views/layout/ColumnLayout";
import { GamePagePopupSettings } from "../GamePagePopupSettings";
import { AutoScrollPane } from "../../../../../views/scrollable-container/AutoScrollPane";
import { SimpleImageButton } from "@flashist/appframework/display/views/button/simple-image-button/SimpleImageButton";
import { RowLayout } from "@flashist/appframework/display/views/layout/RowLayout";

export class SettingsPopupView extends GamePagePopupView {

    protected innerContentCont: BaseLayoutableContainer;
    protected innerContentLayout: ColumnLayout;

    public contentBg: Graphics;

    protected titleLabel: FLabel;

    public soundBtnCont: BaseLayoutableContainer;
    protected soundBtnContLayout: RowLayout;
    protected soundBtnLabel: FLabel;
    public soundBtnImage: SimpleImageButton;

    protected creditsLabel: FLabel;

    protected creditsDescScrollableCont: AutoScrollPane;
    protected creditsDescLabel: FLabel;

    protected versionLabel: FLabel;

    public closeBtn: SimpleImageButton;
    // public closeBtn: BaseBtn;

    protected construction(config: GamePagePopupConfig): void {
        super.construction(config);

        let tempSeparationLine: Graphics;

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
            strokeThickness: 20
        });
        this.innerContentCont.addChild(this.titleLabel);
        //
        this.titleLabel.text = getText("gamePage.settingsPopup.title");

        // SEPARATION
        tempSeparationLine = this.getSeparationLine();
        this.innerContentCont.addChild(tempSeparationLine);


        this.soundBtnCont = new BaseLayoutableContainer();
        this.innerContentCont.addChild(this.soundBtnCont);
        //
        this.soundBtnCont.interactive = true;
        this.soundBtnCont.buttonMode = true;

        this.soundBtnLabel = new FLabel({
            fontFamily: TemplateSettings.fonts.mainFont,
            size: 72,
            bold: true,
            color: TemplateSettings.colors.white,
            autosize: true,
            stroke: 0x000000,
            strokeThickness: 10
        });
        this.soundBtnCont.addChild(this.soundBtnLabel);
        this.soundBtnLabel.text = getText("gamePage.settingsPopup.sound");

        this.soundBtnImage = new SimpleImageButton({
            states: {
                normal: {
                    imageId: "CancelBtn"
                },
                selected_normal: {
                    imageId: "AcceptBtn"
                }
            }
        });
        this.soundBtnCont.addChild(this.soundBtnImage);
        //
        DisplayResizeTools.scaleObject(this.soundBtnImage, 72, 72);

        this.soundBtnContLayout = new RowLayout({ spacingX: 10, valign: VAlign.MIDDLE });
        this.soundBtnContLayout.arrange(this.soundBtnCont);

        //
        const tempTranspBg: Graphics = GraphicsTools.createTraspRect();
        this.soundBtnCont.addChild(tempTranspBg);
        //
        tempTranspBg.width = this.soundBtnCont.width;
        tempTranspBg.height = this.soundBtnCont.height;

        // SEPARATION
        tempSeparationLine = this.getSeparationLine();
        this.innerContentCont.addChild(tempSeparationLine);


        this.creditsLabel = new FLabel({
            fontFamily: TemplateSettings.fonts.mainFont,
            size: 72,
            bold: true,
            color: TemplateSettings.colors.white,
            autosize: true,
            stroke: 0x000000,
            strokeThickness: 10
        });
        this.innerContentCont.addChild(this.creditsLabel);
        this.creditsLabel.text = getText("gamePage.settingsPopup.credits");

        // SEPARATION
        tempSeparationLine = this.getSeparationLine();
        this.innerContentCont.addChild(tempSeparationLine);


        this.creditsDescScrollableCont = new AutoScrollPane({ autoScroll: true });
        this.innerContentCont.addChild(this.creditsDescScrollableCont);

        this.creditsDescLabel = new FLabel({
            fontFamily: TemplateSettings.fonts.mainFont,
            size: 48,
            bold: true,
            color: TemplateSettings.colors.white,
            stroke: 0x000000,
            strokeThickness: 10,

            autosize: true,
            autosizeType: AutosizeType.HEIGHT,
            wordWrap: true
        });
        this.creditsDescScrollableCont.addContent(this.creditsDescLabel);
        //
        this.creditsDescLabel.width = 1070;
        this.creditsDescLabel.wordWrapWidth = this.creditsDescLabel.width;
        //
        this.creditsDescLabel.text = getText("gamePage.settingsPopup.creditsDesc");

        // SEPARATION
        tempSeparationLine = this.getSeparationLine();
        this.innerContentCont.addChild(tempSeparationLine);


        this.versionLabel = new FLabel({
            fontFamily: TemplateSettings.fonts.mainFont,
            size: 32,
            bold: true,
            color: TemplateSettings.colors.white,
            stroke: 0x000000,
            strokeThickness: 4,

            autosize: true
        });
        this.innerContentCont.addChild(this.versionLabel);
        //
        this.versionLabel.text = getText("gamePage.settingsPopup.version", { version: VERSION });


        // Message
        const maxMessageHeight: number = Math.min(600, this.creditsDescLabel.height);
        this.creditsDescScrollableCont.resize(
            this.creditsDescLabel.width,
            maxMessageHeight
        );


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
    }

    protected arrange(): void {
        super.arrange();

        this.innerContentLayout.arrange(this.innerContentCont);

        this.innerContentCont.x = this.contentBg.x + Math.floor((this.contentBg.width - this.innerContentCont.width) / 2);
        this.innerContentCont.y = this.contentBg.y + 20;

        this.contentBg.clear();
        //
        this.contentBg.beginFill(TemplateSettings.colors.lightGrey, 1);
        this.contentBg.lineStyle(GamePagePopupSettings.borderWidth, TemplateSettings.colors.black, 1, 0);
        this.contentBg.drawRect(0, 0, GamePagePopupSettings.bgWidth, this.innerContentCont.height + 180);


        this.closeBtn.x = this.contentBg.x + Math.floor((this.contentBg.width - this.closeBtn.width) / 2);
        this.closeBtn.y = this.contentBg.y + this.contentBg.height - Math.floor(this.closeBtn.height / 2);
    }
}