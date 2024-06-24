import { DisplayResizeTools, Graphics, InteractiveEvent, Sprite } from "@flashist/flibs";
import { BaseAppView } from "@flashist/appframework/base/views/BaseAppView";
import { SymbolIconView } from "../../symbols/SymbolIconView";
import { SingleSymbolEncyclopediaItemRendererEvent } from "./SingleSymbolEncyclopediaItemRendererEvent";
import { ISingleSymbolEncyclopediaItemRendererVO } from "./ISingleSymbolEncyclopediaItemRendererVO";
import { TemplateSettings } from "../../../../../TemplateSettings";

export class SingleSymbolEncyclopediaItemRenderer extends BaseAppView<ISingleSymbolEncyclopediaItemRendererVO> {

    protected rarityBg: Graphics;
    protected icon: Sprite;

    protected symbolIcon: SymbolIconView;
    protected questionIcon: Sprite;

    protected construction(...args) {
        super.construction(...args);

        this.rarityBg = new Graphics();
        this.addChild(this.rarityBg);

        this.symbolIcon = new SymbolIconView();
        this.addChild(this.symbolIcon);
        //
        this.symbolIcon.resize(200, 200);

        this.questionIcon = Sprite.from("QuestionIcon");
        this.addChild(this.questionIcon);
        //
        DisplayResizeTools.scaleObject(this.questionIcon, this.symbolIcon.resizeSize.x, this.symbolIcon.resizeSize.y);
    }

    protected addListeners() {
        super.addListeners();

        this.eventListenerHelper.addEventListener(
            this,
            InteractiveEvent.TAP,
            () => {
                this.globalDispatcher.dispatchEvent(SingleSymbolEncyclopediaItemRendererEvent.TAP, this.data);
            }
        )
    }

    protected commitData(): void {
        super.commitData();

        if (!this.data) {
            return;
        }

        if (this.data.isOpen) {
            this.interactive = true;
            this.buttonMode = true;

            this.symbolIcon.visible = true;
            this.questionIcon.visible = false;

        } else {
            this.interactive = false;
            this.buttonMode = false;

            this.symbolIcon.visible = false;
            this.questionIcon.visible = true;
        }

        this.symbolIcon.symbolId = this.data.symbolConfig.id;

        this.arrange();
    }

    protected arrange() {
        super.arrange();

        // this.rarityBg.width = this.symbolIcon.resizeSize.x;
        // this.rarityBg.height = this.symbolIcon.resizeSize.y;


        this.rarityBg.clear();
        //
        this.rarityBg.lineStyle(8, TemplateSettings.colors.black, 1);
        this.rarityBg.beginFill(this.data.rarityConfig.color, 1);
        this.rarityBg.drawRect(0, 0, this.symbolIcon.resizeSize.x, this.symbolIcon.resizeSize.y);
        this.rarityBg.endFill();

        this.symbolIcon.x = this.rarityBg.x + Math.floor((this.rarityBg.width - this.symbolIcon.width) / 2);
        this.symbolIcon.y = this.rarityBg.y + Math.floor((this.rarityBg.height - this.symbolIcon.height) / 2);

        this.questionIcon.x = this.rarityBg.x + Math.floor((this.rarityBg.width - this.questionIcon.width) / 2);
        this.questionIcon.y = this.rarityBg.y + Math.floor((this.rarityBg.height - this.questionIcon.height) / 2);
    }
}