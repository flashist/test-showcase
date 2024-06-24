import {BaseLayoutableContainer} from "@flashist/appframework/display/views/layout/container/BaseLayoutableContainer";
import {RowLayout} from "@flashist/appframework/display/views/layout/RowLayout";
import {FContainer, FLabel, Graphics, Sprite, VAlign} from "@flashist/flibs";
import {IIconWithTextViewConfigVO} from "./IIconWithTextViewConfigVO";

export class IconWithTextView<DataType extends any = any> extends FContainer<DataType> {

    public config: IIconWithTextViewConfigVO;

    protected innerCont: BaseLayoutableContainer;
    protected layout: RowLayout;
    protected icon: Sprite;
    protected label: FLabel;

    protected transpBg: Graphics;

    private _text: string = "";

    constructor(config: IIconWithTextViewConfigVO) {
        super(config);
    }

    protected construction(config: IIconWithTextViewConfigVO): void {
        super.construction(config);

        this.config = config;

        this.layout = new RowLayout({ spacingX: 5, valign: VAlign.MIDDLE });

        this.transpBg = new Graphics();
        this.addChild(this.transpBg);
        //
        this.transpBg.beginFill(0x000000, 0.5);
        this.transpBg.drawRect(0, 0, 10, 10);
        //
        this.transpBg.alpha = 0;

        this.innerCont = new BaseLayoutableContainer();
        this.addChild(this.innerCont);

        this.icon = Sprite.from(this.config.icon.imageId);
        this.innerCont.addChild(this.icon);

        this.label = new FLabel(this.config.label);
        this.innerCont.addChild(this.label);
    }

    public get text(): string {
        return this._text;
    }
    public set text(value: string) {
        if (value === this.text) {
            return;
        }

        this._text = value;
        this.commitData();
    }

    protected commitData(): void {
        super.commitData();

        this.label.text = this.text;

        this.arrange();
    }

    protected arrange(): void {
        super.arrange();

        this.icon.width = this.config.icon.size.x;
        this.icon.height = this.config.icon.size.y;

        this.layout.arrange(this.innerCont);

        this.transpBg.width = this.innerCont.width;
        this.transpBg.height = this.innerCont.height;
    }
}