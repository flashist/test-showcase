import { BaseBtn } from "@flashist/appframework/display/views/button/BaseBtn";
import { ColumnLayout } from "@flashist/appframework/display/views/layout/ColumnLayout";
import { BaseLayoutableContainer } from "@flashist/appframework/display/views/layout/container/BaseLayoutableContainer";
import { RowLayout } from "@flashist/appframework/display/views/layout/RowLayout";
import { SimpleList } from "@flashist/appframework/display/views/simplelist/SimpleList";
import {
    Align,
    AutosizeType,
    DisplayTools,
    FLabel,
    getInstance,
    getText,
    Graphics,
    Point,
    Sprite,
    VAlign
} from "@flashist/flibs";
import { TemplateSettings } from "../../../../../TemplateSettings";
import { RarityId } from "../../../../game-logic/data/rarity/RarityId";
import { GameLogicTools } from "../../../../game-logic/tools/GameLogicTools";
import { IGameSlotSymbolConfigVO } from "../../../../game-slot-reels/data/symbols/IGameSlotSymbolConfigVO";
import { IconWithTextView } from "../../coins/IconWithTextView";
import { GamePagePopupConfig } from "../GamePagePopupConfig";
import { GamePagePopupSettings } from "../GamePagePopupSettings";
import { GamePagePopupView } from "../GamePagePopupView";
import { SingleRarityChanceView } from "./SingleRarityChanceView";
import { IAddSymbolPopupVO } from "./IAddSymbolPopupVO";
import { IRarityValueVO } from "../../../../game-logic/data/rarity/IRarityValueVO";
import { AddSymbolItemRenderer } from "./AddSymbolItemRenderer";
import { ContainersManager } from "@flashist/appframework/containers/managers/ContainersManager";
import { GameViewId } from "../../GameViewId";
import { PrepareFontId } from "../../../../game-logic/data/PrepareFontId";

export class AddSymbolPopupView extends GamePagePopupView<IAddSymbolPopupVO> {

    protected gameLogicTools: GameLogicTools;

    protected innerContentCont: BaseLayoutableContainer;
    protected innerContentLayout: ColumnLayout;

    public contentBg: Graphics;

    protected titleLabel: FLabel;

    // protected goalInfoCont: BaseLayoutableContainer;
    // protected goalInfoRowLayout: RowLayout;
    // protected goalInfoCoinsIcon: Sprite;
    // protected goalInfoLabel: FLabel;
    protected goalInfoView: IconWithTextView;

    protected rarityCont: BaseLayoutableContainer;
    protected rarityLayout: RowLayout;

    public rerollBtnView: IconWithTextView;

    protected symbolsList: SimpleList<AddSymbolItemRenderer>;
    protected symbolsListLayout: ColumnLayout;

    protected skipBtnImage: Sprite;
    public skipBtn: BaseBtn;

    protected innerContentAvailableWidth: number;

    protected construction(config: GamePagePopupConfig): void {
        super.construction(config);

        this.gameLogicTools = getInstance(GameLogicTools);

        this.innerContentAvailableWidth = GamePagePopupSettings.bgWidth - 40;

        //
        let tempSeparationLine: Graphics;

        this.contentBg = new Graphics();
        this.contentCont.addChild(this.contentBg);

        this.innerContentCont = new BaseLayoutableContainer();
        this.contentCont.addChild(this.innerContentCont);

        // this.innerContentLayout = new ColumnLayout({ spacingY: 30, align: Align.CENTER });
        this.innerContentLayout = new ColumnLayout({ align: Align.CENTER });

        this.titleLabel = new FLabel({
            isBitmap: true,

            fontFamily: PrepareFontId.MAIN_96_WHITE_BLACK_STROKE,
            size: 96,
            bold: true,
            color: TemplateSettings.colors.white,
            stroke: 0x000000,
            strokeThickness: 10,
            autosize: true,
            autosizeType: AutosizeType.WIDTH,
            valign: VAlign.MIDDLE
        });
        this.innerContentCont.addChild(this.titleLabel);
        //
        this.titleLabel.text = getText("gamePage.addSymbolPopup.title");

        // SEPARATION
        tempSeparationLine = this.getSeparationLine();
        this.innerContentCont.addChild(tempSeparationLine);

        this.goalInfoView = new IconWithTextView(
            {
                icon: {
                    imageId: "Symbol_Coin",
                    size: new Point(57, 57),
                },
                // label: {
                //     fontFamily: "NotoSans",
                //     size: 48,
                //     bold: true,
                //     color: TemplateSettings.colors.white,
                //     stroke: 0x000000,
                //     strokeThickness: 5,
                //     valign: VAlign.MIDDLE
                // }
                label: {
                    isBitmap: true,

                    fontFamily: PrepareFontId.MAIN_48_WHITE_BLACK_STROKE,
                    size: 48,
                    bold: true,
                    color: TemplateSettings.colors.white,
                    stroke: 0x000000,
                    strokeThickness: 5,
                    valign: VAlign.MIDDLE
                }
            }
        );
        this.innerContentCont.addChild(this.goalInfoView);
        //
        // this.goalInfoView.alpha = 0.75;

        // this.goalInfoCont = new BaseLayoutableContainer();
        // this.innerContentCont.addChild(this.goalInfoCont);
        // //
        // this.goalInfoCont.alpha = 0.75;

        // this.goalInfoRowLayout = new RowLayout({ valign: VAlign.MIDDLE });

        // this.goalInfoCoinsIcon = Sprite.from("Symbol_Coin");
        // this.goalInfoCont.addChild(this.goalInfoCoinsIcon);
        // //
        // this.goalInfoCoinsIcon.width = 57;
        // this.goalInfoCoinsIcon.height = 57;

        // this.goalInfoLabel = new FLabel({
        //     fontFamily: "NotoSans",
        //     size: 48,
        //     bold: true,
        //     color: TemplateSettings.colors.white,
        //     stroke: 0x000000,
        //     strokeThickness: 5,
        //     autosize: true,
        //     autosizeType: AutosizeType.WIDTH,
        //     valign: VAlign.MIDDLE
        // });
        // this.goalInfoCont.addChild(this.goalInfoLabel);
        // this.goalInfoLabel.height = 80;
        // //
        // // this.goalInfoLabel.x = this.goalInfoCoinsIcon.x + this.goalInfoCoinsIcon.width;

        // SEPARATION
        tempSeparationLine = this.getSeparationLine();
        this.innerContentCont.addChild(tempSeparationLine);


        this.rarityCont = new BaseLayoutableContainer();
        this.innerContentCont.addChild(this.rarityCont);

        this.rarityLayout = new RowLayout();

        // SEPARATION
        tempSeparationLine = this.getSeparationLine();
        this.innerContentCont.addChild(tempSeparationLine);

        this.rerollBtnView = new IconWithTextView(
            {
                icon: {
                    imageId: "RerollIcon",
                    size: new Point(96, 96),
                },
                label: {
                    isBitmap: true,

                    fontFamily: PrepareFontId.MAIN_96_WHITE,
                    size: 96,
                    bold: true,
                    color: TemplateSettings.colors.white,
                    autosize: true
                }
            }
        );
        this.innerContentCont.addChild(this.rerollBtnView);

        // SEPARATION
        tempSeparationLine = this.getSeparationLine();
        this.innerContentCont.addChild(tempSeparationLine);


        this.symbolsList = new SimpleList<AddSymbolItemRenderer, IGameSlotSymbolConfigVO>();
        this.innerContentCont.addChild(this.symbolsList);
        this.symbolsList.interactive = true;
        //
        this.symbolsList.ItemRendererClass = AddSymbolItemRenderer;
        this.symbolsList.useItemsCache = true;
        this.symbolsList.reuseItemsForConcreteData = true;
        this.symbolsList.resizeItems(this.innerContentAvailableWidth, 340);
        // TEST
        // this.symbolsList.dataProvider = [
        //     this.reelsState.slot.static.symbols.configs[SymbolId.CAT],
        //     this.reelsState.slot.static.symbols.configs[SymbolId.COIN],
        //     this.reelsState.slot.static.symbols.configs[SymbolId.CHERRY],
        //     this.reelsState.slot.static.symbols.configs[SymbolId.PEARL],
        //     // this.reelsState.slot.static.symbols.configs[SymbolId.FLOWER],
        // ] as any;

        this.symbolsListLayout = new ColumnLayout();


        this.skipBtnImage = Sprite.from("CancelBtn");
        this.contentCont.addChild(this.skipBtnImage);
        //
        this.skipBtnImage.width = 230;
        this.skipBtnImage.scale.set(this.skipBtnImage.scale.x);

        this.skipBtn = new BaseBtn();
        this.skipBtn.hitArea = this.skipBtnImage;

        //
        const containersManager: ContainersManager = getInstance(ContainersManager);
        containersManager.addContainer(this.titleLabel, GameViewId.ADD_SYMBOL_POPUP_TITLE);
        containersManager.addContainer(this.symbolsList, GameViewId.ADD_SYMBOL_POPUP_SYMBOLS);
        containersManager.addContainer(this.rerollBtnView, GameViewId.ADD_SYMBOL_POPUP_SYMBOLS_REROLLS);
    }

    // protected addListeners(): void {
    //     super.addListeners();
    //
    //     this.eventListenerHelper.addEventListener(
    //         this.symbolsList,
    //         InteractiveEvent.DOWN,
    //         (event: InteractionEvent) => {
    //             // console.log(event);
    //
    //             const itemRenderer: SingleSymbolItemRenderer = (event.target as SingleSymbolItemRenderer);
    //             if (itemRenderer && itemRenderer.data) {
    //                 this.globalDispatcher.dispatchEvent(AddSymbolPopupViewEvent.SYMBOL_SELECT, itemRenderer.data.id);
    //             }
    //         }
    //     );
    // }

    protected commitData(): void {
        super.commitData();

        if (!this.data) {
            return;
        }

        this.symbolsList.dataProvider = this.data.symbols;

        const firstItemRenderer: AddSymbolItemRenderer = this.symbolsList.getItems()[0];
        if (firstItemRenderer) {
            const containersManager: ContainersManager = getInstance(ContainersManager);
            containersManager.addContainer(firstItemRenderer, GameViewId.ADD_SYMBOL_POPUP_FIRST_SYMBOL);
            containersManager.addContainer(firstItemRenderer.valueInfoView, GameViewId.ADD_SYMBOL_POPUP_FIRST_SYMBOL_VALUE);
            containersManager.addContainer(firstItemRenderer.infoCont, GameViewId.ADD_SYMBOL_POPUP_FIRST_SYMBOL_DESC);
        }

        // for (let singleItem of this.symbolsList.getItems()) {
        //     singleItem.interactive = true;
        //     singleItem.buttonMode = true;
        // }

        this.goalInfoView.text = getText(
            "gamePage.goalInfo",
            {
                coins: this.data.coins,
                spins: this.data.spins
            }
        );

        this.rerollBtnView.text = this.data.rerolls.toString();
        if (this.data.rerolls > 0) {
            this.rerollBtnView.alpha = 1;
            this.rerollBtnView.interactive = true;
            this.rerollBtnView.buttonMode = true;

        } else {
            this.rerollBtnView.alpha = 0.5;
            this.rerollBtnView.interactive = false;
            this.rerollBtnView.buttonMode = false;
        }

        this.arrange();
    }

    protected updateRarityCont(): void {
        // Clear previous content
        DisplayTools.removeAllChildren(this.rarityCont);

        // Create new content
        // appStorage().getState<GameLogicModuleState>()("gameLogic.dynamic.finalRarity"
        let rarityViews: SingleRarityChanceView[] = [];
        const finalRarity: IRarityValueVO[] = this.gameLogicTools.getFinalRarity();
        const totalRaritiesWeight: number = this.gameLogicTools.getTotalRaritiesWeight();

        for (let singleRarity of finalRarity) {
            if (singleRarity.value > 0) {

                const singleRarityView: SingleRarityChanceView = new SingleRarityChanceView();
                this.rarityCont.addChild(singleRarityView);
                //
                singleRarityView.chancesCoef = singleRarity.value / totalRaritiesWeight;
                singleRarityView.rarityId = singleRarity.id as RarityId;

                singleRarityView.resize(this.innerContentAvailableWidth * singleRarityView.chancesCoef, 60)
                //
                rarityViews.push(singleRarityView);

            }
        }

        this.rarityLayout.arrange(this.rarityCont);

        const maxTriesCount: number = 5;
        let tryIndex: number = 0;
        while (this.rarityCont.width > this.innerContentAvailableWidth) {
            tryIndex++;
            if (tryIndex > maxTriesCount) {
                break;
            }

            const diff: number = this.rarityCont.width - this.innerContentAvailableWidth;

            let viewsAvailableForResize: SingleRarityChanceView[] = rarityViews.filter((item: SingleRarityChanceView) => {
                return item.width > item.minSize.x;
            });

            const diffPerItem: number = diff / viewsAvailableForResize.length;
            for (let singleRarityView of viewsAvailableForResize) {
                singleRarityView.resize(singleRarityView.width - diffPerItem, singleRarityView.height);
            }

            this.rarityLayout.arrange(this.rarityCont);
        }

    }

    protected arrange(): void {
        super.arrange();

        this.updateRarityCont();

        this.symbolsListLayout.arrange(this.symbolsList);
        // this.goalInfoRowLayout.arrange(this.goalInfoCont);
        this.innerContentLayout.arrange(this.innerContentCont);

        this.innerContentCont.x = this.contentBg.x + Math.floor((this.contentBg.width - this.innerContentCont.width) / 2);
        this.innerContentCont.y = this.contentBg.y + 20;

        this.contentBg.clear();
        //
        // this.contentBg.beginFill(TemplateSettings.colors.lighterGrey, 1);
        this.contentBg.beginFill(TemplateSettings.colors.lightGrey, 1);
        this.contentBg.lineStyle(GamePagePopupSettings.borderWidth, TemplateSettings.colors.black, 1, 0);
        this.contentBg.drawRect(0, 0, GamePagePopupSettings.bgWidth, this.innerContentCont.height + 180);
        //
        // this.contentBg.lineStyle(GamePagePopupSettings.borderWidth, TemplateSettings.colors.black, 1, 0.5);
        // let tempY: number;
        // const innerContChildrenCount: number = this.innerContentCont.children.length;
        // for (let innerContChildIndex: number = 0; innerContChildIndex < innerContChildrenCount; innerContChildIndex++) {
        //     if (innerContChildIndex > 0) {
        //         const curChild = this.innerContentCont.children[innerContChildIndex];
        //         const prevChild = this.innerContentCont.children[innerContChildIndex - 1];

        //         tempY = this.innerContentCont.y + (((prevChild.y + prevChild.height) + curChild.y) / 2);
        //         this.contentBg.drawRect(0, tempY, this.contentBg.width, 0);
        //     }
        // }

        this.skipBtnImage.x = this.contentBg.x + Math.floor((this.contentBg.width - this.skipBtnImage.width) / 2);
        this.skipBtnImage.y = this.contentBg.y + this.contentBg.height - Math.floor(this.skipBtnImage.height / 2);
    }

    protected getSeparationLine(): Graphics {
        const result: Graphics = new Graphics();
        result.lineStyle(GamePagePopupSettings.borderWidth, TemplateSettings.colors.black, 1, 0);
        result.drawRect(0, 0, GamePagePopupSettings.bgWidth, GamePagePopupSettings.borderWidth);
        result.endFill();

        return result;
    }

    // public setSymbols(symbols: IGameSlotSymbolConfigVO[]): void {
    //     this.symbolsList.dataProvider = symbols;
    //     this.arrange();
    // }
}