import gsap from "gsap";
import {Point} from "@flashist/flibs";
import {ScrollPaneConfigVO, ScrollPaneDefaultConfigVO} from "./ScrollPaneConfigVO";
import {ObjectTools} from "@flashist/fcore";
import {ScrollPane} from "./ScrollPane";

export class AutoScrollPane<DataType extends object = object> extends ScrollPane<DataType> {

    protected config: ScrollPaneConfigVO;

    constructor(config?: Partial<ScrollPaneConfigVO>) {
        super(config);
    }

    protected construction(config?: Partial<ScrollPaneConfigVO>, ...args: any[]): void {
        super.construction(config, ...args);

        this.config = ObjectTools.clone(ScrollPaneDefaultConfigVO);
        if (config) {
            ObjectTools.copyProps(this.config, config);
        }
    }

    protected arrange(): void {
        super.arrange();

        if (this.config.autoScroll) {
            this.startScroll();
        }
    }

    public destruction(): void {
        this.stopScroll();

        super.destruction();
    }

    protected startScroll(): void {
        this.stopScroll();

        let finalPos: Point = new Point();
        if (this.contentCont.width > this.contentContMask.width) {
            finalPos.x = this.contentContMask.x + this.contentContMask.width - this.contentCont.width;
        }
        if (this.contentCont.height > this.contentContMask.height) {
            finalPos.y = this.contentContMask.y + this.contentContMask.height - this.contentCont.height;
        }

        const maxDelta: number = Math.max(Math.abs(finalPos.x), Math.abs(finalPos.y));
        if (maxDelta > 0) {
            const duration: number = maxDelta / this.config.speedPixelsPerSec;

            // #1: To bottom / right
            gsap.to(
                this.contentCont,
                {
                    x: finalPos.x,
                    y: finalPos.y,

                    duration: duration,
                    ease: this.config.ease,
                    delay: this.config.scrollDelayMs / 1000
                }

            ).then(
                () => {
                    gsap.to(
                        this.contentCont,
                        {
                            x: 0,
                            y: 0,

                            duration: duration,
                            ease: this.config.ease,
                            delay: this.config.scrollDelayMs / 1000
                        }

                    ).then(
                        () => {
                            this.startScroll();
                        }
                    )
                }
            );
        }
    }

    protected stopScroll(): void {
        gsap.killTweensOf(this.contentCont);

        this.contentCont.x = 0;
        this.contentCont.y = 0;
    }
}