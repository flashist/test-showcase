import { Align, FContainer, FLabel, getText, Graphics } from "@flashist/flibs";
import { TemplateSettings } from "../../../../../TemplateSettings";
import { GamePagePopupView } from "../GamePagePopupView";
import { GamePagePopupConfig } from "../GamePagePopupConfig";
import { BaseLayoutableContainer } from "@flashist/appframework/display/views/layout/container/BaseLayoutableContainer";
import { ColumnLayout } from "@flashist/appframework/display/views/layout/ColumnLayout";
import { GamePagePopupSettings } from "../GamePagePopupSettings";
import { SimpleImageButton } from "@flashist/appframework/display/views/button/simple-image-button/SimpleImageButton";
import { SingleSymbolItemRenderer } from "../symbols/SingleSymbolItemRenderer";
import { IGameSlotSymbolConfigVO } from "../../../../game-slot-reels/data/symbols/IGameSlotSymbolConfigVO";

export class ConfigSymbolInfoPopupView extends GamePagePopupView<IGameSlotSymbolConfigVO> {

    protected innerContentCont: BaseLayoutableContainer;
    protected innerContentLayout: ColumnLayout;

    public contentBg: Graphics;

    protected titleLabel: FLabel;

    protected symbolCont: FContainer;
    protected symbolInfoView: SingleSymbolItemRenderer;

    public closeBtn: SimpleImageButton;

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
        //
        this.titleLabel.text = getText("gamePage.companionSymbolInfoPopup.title");

        this.symbolCont = new FContainer();
        this.innerContentCont.addChild(this.symbolCont);

        this.symbolInfoView = new SingleSymbolItemRenderer();
        this.symbolCont.addChild(this.symbolInfoView);

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

    protected commitData(): void {
        super.commitData();

        if (!this.data) {
            return;
        }

        this.symbolInfoView.data = this.data;

        this.arrange();
    }

    protected arrange(): void {
        super.arrange();

        if (!this.data) {
            return;
        }

        this.symbolInfoView.resize(GamePagePopupSettings.bgWidth - 50, 500);

        this.innerContentLayout.arrange(this.innerContentCont);

        // this.contentBg.height = this.innerContentCont.height + 180;

        this.innerContentCont.x = this.contentBg.x + Math.floor((this.contentBg.width - this.innerContentCont.width) / 2);
        this.innerContentCont.y = this.contentBg.y + 20;

        this.contentBg.clear();
        //
        this.contentBg.beginFill(TemplateSettings.colors.lightGrey, 1);
        this.contentBg.lineStyle(GamePagePopupSettings.borderWidth, TemplateSettings.colors.black, 1, 0);
        this.contentBg.drawRect(0, 0, GamePagePopupSettings.bgWidth, this.innerContentCont.height + 180);
        //
        let tempY: number;
        //
        this.contentBg.lineStyle(GamePagePopupSettings.borderWidth, TemplateSettings.colors.black, 1, 0.5);
        //
        tempY = this.innerContentCont.y + (((this.titleLabel.y + this.titleLabel.height) + this.symbolCont.y) / 2);
        this.contentBg.drawRect(0, tempY, this.contentBg.width, 0);

        this.closeBtn.x = this.contentBg.x + Math.floor((this.contentBg.width - this.closeBtn.width) / 2);
        this.closeBtn.y = this.contentBg.y + this.contentBg.height - Math.floor(this.closeBtn.height / 2);
    }
}