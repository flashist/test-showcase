import { DisplayObjectContainer, DisplayTools, FContainer, Sprite } from "@flashist/flibs";
import { ISlotReelSymbolWrapperAnimVO } from "./ISlotReelSymbolWrapperAnimVO";

export class SlotReelSymbolWrapperAnimView extends FContainer<ISlotReelSymbolWrapperAnimVO> {

    protected contentCont: FContainer;
    protected curView: DisplayObjectContainer;

    protected construction(...args: any[]): void {
        super.construction(...args);

        this.contentCont = new FContainer();
        this.addChild(this.contentCont);
    }

    protected commitData(): void {
        super.commitData();

        if (!this.data) {
            return;
        }

        this.createView();

        this.arrange();
    }

    protected createView(): void {
        this.removeCurView();

        const tempSpriteId: string = this.getSpriteId();
        this.curView = Sprite.from(tempSpriteId);
        this.contentCont.addChild(this.curView);
        // TEMP: do manual alignment by the center of the image. Should be changed with proper visual configuration of symbols
        this.curView.pivot.x = Math.floor(this.curView.width / 2);
        this.curView.pivot.y = Math.floor(this.curView.height / 2);
    }

    protected getSpriteId(): string {
        return this.data.symbolConfig.states.normal.id;
    }

    protected removeCurView(): void {
        if (!this.curView) {
            return;
        }

        DisplayTools.childRemoveItselfFromParent(this.curView);
        this.curView = null;
    }

    public play(): Promise<void> {
        // TODO: implement in subclasses
        return Promise.resolve();
    }

    public stop(): void {
        // TODO: implement in subclasses
    }

}