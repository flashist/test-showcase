import gsap from "gsap";

import { ResizableContainer } from "@flashist/appframework";
import { DisplayObject, FContainer, Graphics, Point } from "@flashist/flibs";
import { ScrollPaneConfigVO, ScrollPaneDefaultConfigVO } from "./ScrollPaneConfigVO";
import { ObjectTools } from "@flashist/fcore";

export class ScrollPane<DataType extends object = object> extends ResizableContainer<DataType> {

    protected contentCont: FContainer;
    protected contentContMask: Graphics;

    protected construction(...args: any[]): void {
        super.construction(...args);

        this.contentCont = new FContainer();
        this.addChild(this.contentCont);

        this.contentContMask = new Graphics();
        this.addChild(this.contentContMask);
        //
        this.contentContMask.beginFill(0xFF0000, 0.5);
        this.contentContMask.drawRect(0, 0, 10, 10);
        //
        this.contentCont.mask = this.contentContMask;
    }

    public addContent(child: DisplayObject): void {
        this.contentCont.addChild(child);

        this.arrange();
    }

    protected arrange(): void {
        super.arrange();

        this.contentContMask.width = this.resizeSize.x;
        this.contentContMask.height = this.resizeSize.y;
    }
}