import gsap from "gsap";

import {DisplayTools, Graphics, RendererEvent} from "@flashist/flibs";
import {SplashEffectConfigVO, SplashEffectDefaultConfigVO} from "./SplashEffectConfigVO";
import {ObjectTools} from "@flashist/fcore";
import {BaseAppView} from "@flashist/appframework/base/views/BaseAppView";
import {Facade} from "@flashist/appframework/facade/Facade";

export class SplashEffectView extends BaseAppView {

    protected config: SplashEffectConfigVO;

    protected bg: Graphics;

    constructor(config?: Partial<SplashEffectConfigVO>) {
        super(config);
    }

    protected construction(config?: SplashEffectConfigVO, ...args: any[]) {
        super.construction(config, ...args);

        this.config = ObjectTools.clone(SplashEffectDefaultConfigVO);
        ObjectTools.copyProps(this.config, config);

        this.bg = new Graphics();
        this.addChild(this.bg);
        //
        this.bg.beginFill(this.config.color, this.config.alpha);
        this.bg.drawRect(0,0,10,10);

        //
        this.alpha = 0;
    }

    protected addListeners() {
        super.addListeners();

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            RendererEvent.RESIZE,
            this.arrange
        );
    }

    protected arrange() {
        super.arrange();

        this.bg.width = Facade.instance.app.renderer.width;
        this.bg.height = Facade.instance.app.renderer.height;
    }

    public async show(): Promise<void> {
        await gsap.to(
            this,
            {
                alpha: 1,
                duration: 0.1,
                ease: "circ.out"
            }
        );
    }

    public async hide(): Promise<void> {
        await gsap.to(
            this,
            {
                alpha: 0,
                duration: 1,
                ease: "circ.out"
            }
        );

        DisplayTools.childRemoveItselfFromParent(this);
    }
}