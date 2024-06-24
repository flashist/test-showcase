import { BaseAppView } from "@flashist/appframework/base/views/BaseAppView";
import { Rectangle } from "@flashist/flibs";

export class SlotReelsView extends BaseAppView {

    public sizeArea: Rectangle;

    protected construction(...args: any[]): void {
        super.construction(...args);

        this.sizeArea = new Rectangle();
    }
}