import { BaseAppView } from "@flashist/appframework/base/views/BaseAppView";
import { BaseLayoutableContainer } from "@flashist/appframework/display/views/layout/container/BaseLayoutableContainer";
import { ColumnLayout } from "@flashist/appframework/display/views/layout/ColumnLayout";
import { ObjectTools } from "@flashist/fcore";
import { FContainer, Graphics } from "@flashist/flibs";
import { DefaultGamePagePopupConfig, GamePagePopupConfig } from "./GamePagePopupConfig";
import {TimeoutTools} from "@flashist/flibs/timeout/tools/TimeoutTools";
import {GamePagePopupSettings} from "./GamePagePopupSettings";
import {TemplateSettings} from "../../../../TemplateSettings";

export class GamePagePopupView<DataType extends object = object> extends BaseAppView<DataType> {

    public bg: Graphics;
    protected contentCont: FContainer;

    protected config: GamePagePopupConfig;

    protected interactionTimeout: any;

    constructor(config?: Partial<GamePagePopupConfig>) {
        if (!config) {
            config = {};
        }
        ObjectTools.copyProps(config, DefaultGamePagePopupConfig, { ignoreExistedProperties: true });

        super(config);
    }

    protected construction(config: GamePagePopupConfig): void {
        super.construction(config);

        this.config = config;

        this.bg = new Graphics();
        this.addChild(this.bg);
        //
        this.bg.interactive = true;

        this.contentCont = new BaseLayoutableContainer();
        this.addChild(this.contentCont);
        //
        this.contentCont.interactive = true;

        //
        this.interactiveChildren = false;
    }

    private _contentScale: number = 1;
    public get contentScale(): number {
        return this._contentScale;
    }
    public set contentScale(value: number) {
        if (value === this.contentScale) {
            return;
        }

        this._contentScale = value;

        this.arrange();
    }

    protected arrange(): void {
        super.arrange();

        this.bg.clear();
        //
        this.bg.beginFill(this.config.bgColor, this.config.bgAlpha);
        this.bg.drawRect(0, 0, this.resizeSize.x, this.resizeSize.y);

        //
        this.contentCont.scale.set(this.contentScale);
        this.contentCont.x = this.bg.x + Math.floor((this.bg.width - this.contentCont.width) / 2);
        this.contentCont.y = this.bg.y + Math.floor((this.bg.height - this.contentCont.height) / 2);
    }

    public show(): void {
        this.visible = true;
        this.interactionTimeout = setTimeout(
            () => {
                this.interactiveChildren = true;
            },
            250
        );

        this.arrange();
    }

    public hide(): void {
        this.visible = false;
        this.interactiveChildren = false;

        if (this.interactionTimeout) {
            clearTimeout(this.interactionTimeout)
            this.interactionTimeout = null;
        }
    }

    protected getSeparationLine(): Graphics {
        const result: Graphics = new Graphics();
        result.lineStyle(GamePagePopupSettings.borderWidth, TemplateSettings.colors.black, 1, 0);
        result.drawRect(0, 0, GamePagePopupSettings.bgWidth, GamePagePopupSettings.borderWidth);
        result.endFill();

        return result;
    }
}