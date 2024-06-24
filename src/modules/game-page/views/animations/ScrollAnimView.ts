import gsap from "gsap";

import {FContainer, Sprite} from "@flashist/flibs";

export class ScrollAnimView extends FContainer {
    protected icon: Sprite;

    protected construction(...args) {
        super.construction(...args);

        this.icon = Sprite.from("HandPointFingerIcon");
        this.addChild(this.icon);
        //
        this.icon.anchor.set(0.5);
        //
        this.icon.rotation = -1 * Math.PI / 4;

        this.startAnim();
    }

    protected async startAnim(): Promise<void> {
        gsap.killTweensOf(this.icon);

        this.icon.y = 200;
        this.icon.alpha = 0;

        gsap.to(
            this.icon,
            {
                alpha: 1,
                duration: 0.2
            }
        );
        gsap.to(
            this.icon,
            {
                alpha: 0,
                duration: 0.2,
                delay: 0.8
            }
        );

        await gsap.to(
            this.icon,
            {
                y: -200,
                duration: 1,
                ease: "circ.inOut"
            }
        );

        // await gsap.to(
        //     this.icon,
        //     {
        //         rotation: -Math.PI / 4,
        //         duration: 0.5
        //     }
        // );
        //
        // await gsap.to(
        //     this.icon,
        //     {
        //         rotation: 0,
        //         duration: 1
        //     }
        // );

        this.startAnim();
    }
}