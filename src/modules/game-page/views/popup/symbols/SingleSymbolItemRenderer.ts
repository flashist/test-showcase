import { BaseAppView } from "@flashist/appframework/base/views/BaseAppView";
import { FContainer, FLabel, getInstance, getText, Graphics, InteractiveEvent, Point, VAlign } from "@flashist/flibs";
import { TemplateSettings } from "../../../../../TemplateSettings";
import { IGameSlotSymbolConfigVO } from "../../../../game-slot-reels/data/symbols/IGameSlotSymbolConfigVO";
import { SymbolIconView } from "../../symbols/SymbolIconView";
import { GamePagePopupSettings } from "../GamePagePopupSettings";
import { GameLogicTools } from "../../../../game-logic/tools/GameLogicTools";
import { IRarityConfigVO } from "../../../../game-logic/data/rarity/IRarityConfigVO";
import { IconWithTextView } from "../../coins/IconWithTextView";
import { RarityId } from "../../../../game-logic/data/rarity/RarityId";
import { PrepareFontId } from "../../../../game-logic/data/PrepareFontId";

export class SingleSymbolItemRenderer extends BaseAppView<IGameSlotSymbolConfigVO> {

    protected gameLogicTools: GameLogicTools;

    protected cacheCont: FContainer;

    protected bg: Graphics;
    protected bottomSeparator: Graphics;

    protected symbolIcon: SymbolIconView;

    public infoCont: FContainer;
    protected titleLabel: FLabel;
    protected descriptionLabel: FLabel;

    public valueInfoView: IconWithTextView;

    public labelWidthPadding: number = 0;

    protected construction(...args: any[]): void {
        super.construction(...args);

        // this.interactive = true;
        // this.buttonMode = true;

        this.gameLogicTools = getInstance(GameLogicTools);

        this.cacheCont = new FContainer();
        this.addChild(this.cacheCont);

        this.bg = new Graphics();
        this.cacheCont.addChild(this.bg);

        this.bottomSeparator = new Graphics();
        this.cacheCont.addChild(this.bottomSeparator);
        //
        this.bottomSeparator.beginFill(TemplateSettings.colors.black);
        this.bottomSeparator.drawRect(0, 0, 10, GamePagePopupSettings.borderWidth);

        this.symbolIcon = new SymbolIconView();
        this.cacheCont.addChild(this.symbolIcon);
        //
        this.symbolIcon.resize(230, 230);
        //
        // this.symbolIcon.cacheAsBitmap = true;
        // this.symbolIcon.filters = [new OutlineFilter(2, TemplateSettings.colors.black, 1)];

        this.infoCont = new FContainer();
        this.cacheCont.addChild(this.infoCont);

        this.titleLabel = new FLabel(
            // {
            //     fontFamily: "NotoSans",
            //     size: 48,
            //     bold: true,
            //     color: TemplateSettings.colors.white,
            //     stroke: 0x000000,
            //     strokeThickness: 5,
            //     valign: VAlign.MIDDLE,
            //
            //     autosize: false,
            //     fitToSize: true
            // }
            {
                isBitmap: true,

                fontFamily: PrepareFontId.MAIN_48_WHITE_BLACK_STROKE,
                size: 48,
                bold: true,
                color: TemplateSettings.colors.white,
                stroke: 0x000000,
                strokeThickness: 5,
                valign: VAlign.MIDDLE,

                autosize: false,
                fitToSize: true
            }
        );
        this.infoCont.addChild(this.titleLabel);

        this.descriptionLabel = new FLabel(
            // {
            //     fontFamily: "NotoSans",
            //     bold: true,
            //     // size: 48,
            //     color: TemplateSettings.colors.black,
            //     autosize: false,
            //     fitToSize: true,
            //     changeFontSizeToFit: true,
            //     changeFontSizeStepChange: -2,
            //     wordWrap: true
            // }
            {
                isBitmap: true,

                fontFamily: PrepareFontId.MAIN_48_BLACK,
                bold: true,
                // size: 48,
                color: TemplateSettings.colors.black,
                autosize: false,
                fitToSize: true,
                changeFontSizeToFit: true,
                changeFontSizeStepChange: -2,
                wordWrap: true
            }
        );
        this.infoCont.addChild(this.descriptionLabel);


        this.valueInfoView = new IconWithTextView(
            {
                icon: {
                    imageId: "Symbol_Coin",
                    size: new Point(64, 64)
                },
                // label: {
                //     fontFamily: "NotoSans",
                //     size: 64,
                //     bold: true,
                //     color: TemplateSettings.colors.white,
                //     stroke: 0x000000,
                //     strokeThickness: 5,
                //     autosize: true,
                //     valign: VAlign.MIDDLE
                // }
                label: {
                    isBitmap: true,

                    fontFamily: PrepareFontId.MAIN_96_WHITE_BLACK_STROKE,
                    size: 64,
                    bold: true,
                    color: TemplateSettings.colors.white,
                    stroke: 0x000000,
                    strokeThickness: 5,
                    autosize: true,
                    valign: VAlign.MIDDLE
                }
            }
        );
        this.cacheCont.addChild(this.valueInfoView);
    }

    protected addListeners(): void {
        super.addListeners();

        this.eventListenerHelper.addEventListener(
            this,
            InteractiveEvent.DOWN,
            () => {
                // this.globalDispatcher.dispatchEvent(AddSymbolPopupViewEvent.SYMBOL_SELECT, this.data.id);
            }
        )
    }

    protected commitData(): void {
        super.commitData();

        if (!this.data) {
            return;
        }

        this.symbolIcon.symbolId = this.data.id;

        let rarityConfig: IRarityConfigVO = this.gameLogicTools.getRarityConfig(this.data.rarity);

        let titleText: string;
        if (rarityConfig) {
            titleText = getText(
                "gamePage.symbolTitle",
                {
                    symbol: getText(this.data.titleId).toUpperCase(),
                    rarity: getText(rarityConfig.titleId)
                }
            );
        } else {
            titleText = getText(
                "gamePage.symbolWithoutRarityTitle",
                {
                    symbol: getText(this.data.titleId).toUpperCase()
                }
            );
        }

        this.titleLabel.text = titleText;
        if (this.data.tags) {
            this.titleLabel.text += " [";

            for (let singleTag of this.data.tags) {
                this.titleLabel.text += getText(`tags.${singleTag}`);
            }

            this.titleLabel.text += "]";
        }

        if (this.data.descriptionId) {
            this.descriptionLabel.text = getText(this.data.descriptionId);
        } else {
            this.descriptionLabel.text = "";
        }

        this.valueInfoView.text = this.data.value.toString();

        this.arrange();
    }

    protected arrange(): void {
        super.arrange();

        if (!this.data) {
            return;
        }

        // this.cacheCont.cacheAsBitmap = false;

        this.titleLabel.x = this.symbolIcon.x + this.symbolIcon.width + 10;
        //
        this.titleLabel.width = this.resizeSize.x - this.titleLabel.x - this.labelWidthPadding;
        this.titleLabel.height = 65;

        this.descriptionLabel.x = this.titleLabel.x;
        this.descriptionLabel.y = this.titleLabel.y + this.titleLabel.height;

        this.descriptionLabel.wordWrapWidth = this.titleLabel.width;
        this.descriptionLabel.width = this.descriptionLabel.wordWrapWidth;
        //
        this.descriptionLabel.height = this.resizeSize.y - this.descriptionLabel.y;
        //
        // Change size of the label every time after changing its text, width or height,
        // because the descrition label is configured the way,
        // that its font size is changed to fit the available size
        this.descriptionLabel.size = 48;

        this.bg.clear();
        //
        let rarityConfig: IRarityConfigVO = this.gameLogicTools.getRarityConfig(this.data.rarity);
        if (!rarityConfig) {
            rarityConfig = this.gameLogicTools.getRarityConfig(RarityId.COMMON);
        }
        this.bg.beginFill(rarityConfig.color, 1);
        this.bg.drawRect(0, 0, this.resizeSize.x, this.resizeSize.y);
        //
        this.bottomSeparator.width = this.resizeSize.x;
        this.bottomSeparator.y = this.bg.y + this.bg.height;

        this.symbolIcon.x = 10;
        // this.symbolIcon.y = this.bg.y + Math.floor((this.bg.height - this.symbolIcon.height) / 2);
        this.symbolIcon.y = this.valueInfoView.y + this.valueInfoView.height;

        // this.valueInfoView.x = this.bg.x + this.bg.width - this.valueInfoView.width - 10;
        this.valueInfoView.x = this.symbolIcon.x + Math.floor((this.symbolIcon.width - this.valueInfoView.width) / 2);

        // this.cacheCont.cacheAsBitmap = true;
    }
}