import { Align, DisplayTools, FLabel, getInstance, getText, Graphics, Point } from "@flashist/flibs";
import { TemplateSettings } from "../../../../../TemplateSettings";
import { GamePagePopupView } from "../GamePagePopupView";
import { GamePagePopupConfig } from "../GamePagePopupConfig";
import { BaseLayoutableContainer } from "@flashist/appframework/display/views/layout/container/BaseLayoutableContainer";
import { ColumnLayout } from "@flashist/appframework/display/views/layout/ColumnLayout";
import { GamePagePopupSettings } from "../GamePagePopupSettings";
import { IconWithTextView } from "../../coins/IconWithTextView";
import { ContainersManager } from "@flashist/appframework/containers/managers/ContainersManager";
import { GameViewId } from "../../GameViewId";
import { SimpleImageButton } from "@flashist/appframework/display/views/button/simple-image-button/SimpleImageButton";
import { IMissionBonusPopupVO } from "./IMissionBonusPopupVO";
import { PrepareFontId } from "../../../../game-logic/data/PrepareFontId";

export class MissionBonusPopupView extends GamePagePopupView<IMissionBonusPopupVO> {

    protected innerContentCont: BaseLayoutableContainer;
    protected innerContentLayout: ColumnLayout;

    public contentBg: Graphics;

    protected titleLabel: FLabel;

    protected bonusesCont: BaseLayoutableContainer;
    protected bonusesContentLayout: ColumnLayout;

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
        this.titleLabel.text = getText("gamePage.missionBonusPopup.title");

        this.bonusesCont = new BaseLayoutableContainer();
        this.innerContentCont.addChild(this.bonusesCont);

        this.bonusesContentLayout = new ColumnLayout({ spacingY: 30, align: Align.CENTER });

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
        containersManager.addContainer(this.bonusesCont, GameViewId.MISSION_BONUS_POPUP_BONUSES);
    }

    protected commitData(): void {
        super.commitData();

        if (!this.data) {
            return;
        }

        // Remove all prev children
        DisplayTools.removeAllChildren(this.bonusesCont);
        //
        if (this.data.rerolls) {
            let tempRerollInfo: IconWithTextView = new IconWithTextView(
                {
                    icon: {
                        imageId: "RerollIcon",
                        size: new Point(115, 115)
                    },
                    // label: {
                    //     fontFamily: "NotoSans",
                    //     size: 96,
                    //     bold: true,
                    //     color: TemplateSettings.colors.white,
                    //     autosize: true,
                    //     stroke: 0x000000,
                    //     strokeThickness: 10
                    // }
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
            this.bonusesCont.addChild(tempRerollInfo);
            //
            tempRerollInfo.text = this.data.rerolls.toString();
        }
        if (this.data.removes) {
            let tempRemovesInfo: IconWithTextView = new IconWithTextView(
                {
                    icon: {
                        imageId: "RemoveIcon",
                        size: new Point(115, 115)
                    },
                    // label: {
                    //     fontFamily: "NotoSans",
                    //     size: 96,
                    //     bold: true,
                    //     color: TemplateSettings.colors.white,
                    //     autosize: true,
                    //     stroke: 0x000000,
                    //     strokeThickness: 10
                    // }
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
            this.bonusesCont.addChild(tempRemovesInfo);
            //
            tempRemovesInfo.text = this.data.removes.toString();
        }

        this.arrange();
    }

    protected arrange(): void {
        super.arrange();

        this.bonusesContentLayout.arrange(this.bonusesCont);

        this.innerContentLayout.arrange(this.innerContentCont);

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
        tempY = this.innerContentCont.y + (((this.titleLabel.y + this.titleLabel.height) + this.bonusesCont.y) / 2);
        this.contentBg.drawRect(0, tempY, this.contentBg.width, 0);
        //
        // tempY = this.innerContentCont.y + (((this.bonusesCont.y + this.bonusesCont.height) + this.messageScrollableCont.y) / 2);
        // this.contentBg.drawRect(0, tempY, this.contentBg.width, 0);

        this.closeBtn.x = this.contentBg.x + Math.floor((this.contentBg.width - this.closeBtn.width) / 2);
        this.closeBtn.y = this.contentBg.y + this.contentBg.height - Math.floor(this.closeBtn.height / 2);
    }
}