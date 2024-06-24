import { BaseBtn } from "@flashist/appframework/display/views/button/BaseBtn";
import { ColumnLayout } from "@flashist/appframework/display/views/layout/ColumnLayout";
import { BaseLayoutableContainer } from "@flashist/appframework/display/views/layout/container/BaseLayoutableContainer";
import { SimpleList } from "@flashist/appframework/display/views/simplelist/SimpleList";
import {
    Align,
    AutosizeType,
    DragHelperEvent,
    FLabel,
    getInstance,
    getText,
    Graphics,
    GraphicsTools,
    InteractiveEvent,
    Point,
    Sprite,
    VAlign
} from "@flashist/flibs";
import { TemplateSettings } from "../../../../../TemplateSettings";
import { GameLogicTools } from "../../../../game-logic/tools/GameLogicTools";
import { IconWithTextView } from "../../coins/IconWithTextView";
import { GamePagePopupConfig } from "../GamePagePopupConfig";
import { GamePagePopupSettings } from "../GamePagePopupSettings";
import { GamePagePopupView } from "../GamePagePopupView";
import { SingleSymbolItemRenderer } from "../symbols/SingleSymbolItemRenderer";
import { IInventoryPopupVO } from "./IInveintoryPopupVO";

import { InteractionEvent } from "pixi.js";
import { ScrollAnimView } from "../../animations/ScrollAnimView";
import { DragScrollPane } from "../../../../../views/scrollable-container/DragScrollPane";
import { ArrayTools } from "@flashist/fcore";
import { SingleSymbolInventoryItemRenderer } from "./SingleSymbolInventoryItemRenderer";
import { IGameSlotSymbolCompanionVO } from "../../../../game-slot-reels/data/symbols/IGameSlotSymbolCompanionVO";
import { ContainersManager } from "@flashist/appframework/containers/managers/ContainersManager";
import { GameViewId } from "../../GameViewId";
import { MultiColumnLayout } from "@flashist/appframework";
import { PrepareFontId } from "../../../../game-logic/data/PrepareFontId";

export class InventoryPopupView extends GamePagePopupView<IInventoryPopupVO> {

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

    protected symbolsCountLabel: FLabel;

    public removesView: IconWithTextView;

    protected symbolsListTraspBg: Graphics;
    protected symbolsList: SimpleList<SingleSymbolInventoryItemRenderer, IGameSlotSymbolCompanionVO>;
    protected symbolsListLayout: MultiColumnLayout;
    public symbolsScrollPane: DragScrollPane;

    protected closeBtnImage: Sprite;
    public closeBtn: BaseBtn;

    protected innerContentAvailableWidth: number;

    protected scrollAnimView: ScrollAnimView;
    protected wasScrolled: boolean;
    protected scrollHintTimeout: any;

    protected symbolsVisibleCountWithoutScroll: number = 20;

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

        this.titleLabel = new FLabel(
            {
                isBitmap: true,

                fontFamily: PrepareFontId.MAIN_96_WHITE_BLACK_STROKE,
                size: 96,
                bold: true,
                color: TemplateSettings.colors.white,
                stroke: 0x000000,
                strokeThickness: 20,
                autosize: true,
                autosizeType: AutosizeType.WIDTH,
                valign: VAlign.MIDDLE
            }
        );
        this.innerContentCont.addChild(this.titleLabel);
        //
        this.titleLabel.text = getText("gamePage.inventoryPopup.title");

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

        // SEPARATION
        tempSeparationLine = this.getSeparationLine();
        this.innerContentCont.addChild(tempSeparationLine);


        this.symbolsCountLabel = new FLabel(
            // {
            //             fontFamily: "NotoSans",
            //             size: 48,
            //             bold: true,
            //             color: TemplateSettings.colors.white,
            //             stroke: 0x000000,
            //             strokeThickness: 5,
            //             valign: VAlign.MIDDLE
            //         }
            {
                isBitmap: true,

                fontFamily: PrepareFontId.MAIN_48_WHITE_BLACK_STROKE,
                size: 48,
                bold: true,
                color: TemplateSettings.colors.white,
                stroke: 0x000000,
                strokeThickness: 5,
                valign: VAlign.MIDDLE
            }
        );
        this.innerContentCont.addChild(this.symbolsCountLabel);

        // SEPARATION
        tempSeparationLine = this.getSeparationLine();
        this.innerContentCont.addChild(tempSeparationLine);


        this.removesView = new IconWithTextView(
            {
                icon: {
                    imageId: "RemoveIcon",
                    size: new Point(96, 96),
                },
                // label: {
                //     fontFamily: "NotoSans",
                //     size: 96,
                //     bold: true,
                //     color: TemplateSettings.colors.white,
                //     autosize: true
                // }
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
        this.innerContentCont.addChild(this.removesView);

        // SEPARATION
        tempSeparationLine = this.getSeparationLine();
        this.innerContentCont.addChild(tempSeparationLine);


        this.symbolsScrollPane = new DragScrollPane();
        this.innerContentCont.addChild(this.symbolsScrollPane);

        this.symbolsListTraspBg = GraphicsTools.createTraspRect();
        this.symbolsScrollPane.addContent(this.symbolsListTraspBg);

        this.symbolsList = new SimpleList<SingleSymbolInventoryItemRenderer, IGameSlotSymbolCompanionVO>();
        this.symbolsScrollPane.addContent(this.symbolsList);
        //
        this.symbolsList.ItemRendererClass = SingleSymbolInventoryItemRenderer;
        this.symbolsList.useItemsCache = true;
        this.symbolsList.reuseItemsForConcreteData = true;
        this.symbolsList.resizeItems(this.innerContentAvailableWidth, 340);

        this.symbolsListLayout = new MultiColumnLayout({ columnsCount: 5, spacingX: 20, spacingY: 20 });

        // SEPARATION
        tempSeparationLine = this.getSeparationLine();
        this.innerContentCont.addChild(tempSeparationLine);


        this.closeBtnImage = Sprite.from("AcceptBtn");
        this.contentCont.addChild(this.closeBtnImage);
        //
        this.closeBtnImage.width = 230;
        this.closeBtnImage.scale.set(this.closeBtnImage.scale.x);

        this.closeBtn = new BaseBtn();
        this.closeBtn.hitArea = this.closeBtnImage;

        this.scrollAnimView = new ScrollAnimView();
        this.contentCont.addChild(this.scrollAnimView);
        //
        this.scrollAnimView.scale.set(0.5);
        this.scrollAnimView.alpha = 0.75;
        //
        this.scrollAnimView.visible = false;

        // //
        // const containersManager: ContainersManager = getInstance(ContainersManager);
        // containersManager.addContainer(this.removesView, GameViewId.INVENTORY_POPUP_REMOVES);
    }

    protected addListeners(): void {
        super.addListeners();

        this.eventListenerHelper.addEventListener(
            this.symbolsList,
            InteractiveEvent.DOWN,
            (event: InteractionEvent) => {
                // console.log(event);

                const itemRenderer: SingleSymbolItemRenderer = (event.target as SingleSymbolItemRenderer);
                if (itemRenderer && itemRenderer.data) {
                    // this.globalDispatcher.dispatchEvent(AddSymbolPopupViewEvent.SYMBOL_SELECT, itemRenderer.data.id);
                }
            }
        );

        this.eventListenerHelper.addEventListener(
            this.symbolsScrollPane.dragHelper,
            DragHelperEvent.DRAG_UPDATE,
            this.onDragUpdate
        );
    }

    protected onDragUpdate(): void {
        if (!this.data) {
            return;
        }

        if (!this.checkIfScrollAvailable()) {
            return
        }

        this.wasScrolled = true;
        this.hideScrollHint();
    }

    protected commitData(): void {
        super.commitData();

        if (!this.data) {
            return;
        }

        this.symbolsCountLabel.text = getText("gamePage.inventoryPopup.symbolsCount", { symbols: this.data.symbols.length });

        let areSymbolsEqual: boolean = ArrayTools.checkIfEqual(this.symbolsList.dataProvider, this.data.symbols);
        if (!areSymbolsEqual) {
            this.symbolsList.dataProvider = this.data.symbols;

            const firstItemRenderer: SingleSymbolInventoryItemRenderer = this.symbolsList.getItems()[0];
            if (firstItemRenderer) {
                const containersManager: ContainersManager = getInstance(ContainersManager);
                containersManager.addContainer(firstItemRenderer, GameViewId.INVENTORY_POPUP_FIRST_SYMBOL);
            }
        }

        this.goalInfoView.text = getText(
            "gamePage.goalInfo",
            {
                coins: this.data.coins,
                spins: this.data.spins
            }
        );

        this.removesView.text = this.data.removes.toString();
        if (this.data.removes > 0) {
            this.removesView.alpha = 1;
        } else {
            this.removesView.alpha = 0.5;
        }

        this.arrange();
    }

    protected arrange(): void {
        super.arrange();

        this.symbolsListLayout.arrange(this.symbolsList);

        if (this.symbolsList.width > 0) {
            this.symbolsScrollPane.resize(this.symbolsList.width, 800);
        }

        this.symbolsListTraspBg.width = this.symbolsList.width;
        this.symbolsListTraspBg.height = this.symbolsList.height;

        this.innerContentLayout.arrange(this.innerContentCont);

        this.innerContentCont.x = this.contentBg.x + Math.floor((this.contentBg.width - this.innerContentCont.width) / 2);
        this.innerContentCont.y = this.contentBg.y + 20;

        this.contentBg.clear();
        //
        this.contentBg.beginFill(TemplateSettings.colors.lightGrey, 1);
        this.contentBg.lineStyle(GamePagePopupSettings.borderWidth, TemplateSettings.colors.black, 1, 0);
        this.contentBg.drawRect(0, 0, GamePagePopupSettings.bgWidth, this.innerContentCont.height + 180);

        this.closeBtnImage.x = this.contentBg.x + Math.floor((this.contentBg.width - this.closeBtnImage.width) / 2);
        this.closeBtnImage.y = this.contentBg.y + this.contentBg.height - Math.floor(this.closeBtnImage.height / 2);

        //
        this.scrollAnimView.x = this.symbolsScrollPane.x + Math.floor(this.symbolsScrollPane.width / 2);
        this.scrollAnimView.y = this.symbolsScrollPane.y + Math.floor(this.symbolsScrollPane.height / 2);
    }

    public show(): void {
        super.show();

        this.symbolsScrollPane.resetScroll();

        if (!this.wasScrolled) {
            if (this.checkIfScrollAvailable()) {
                this.showScrollHintWithTimeout();
            }
        }
    }

    protected showScrollHintWithTimeout(): void {
        this.hideScrollHint();

        this.scrollHintTimeout = setTimeout(
            () => {
                this.scrollAnimView.visible = true;
            },
            5000
        );
    }

    protected hideScrollHint(): void {
        if (this.scrollHintTimeout) {
            clearTimeout(this.scrollHintTimeout);
        }

        this.scrollAnimView.visible = false;
    }

    protected checkIfScrollAvailable(): boolean {
        return this.data.symbols.length > this.symbolsVisibleCountWithoutScroll;
    }

}