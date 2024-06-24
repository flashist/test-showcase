import {DragHelper} from "@flashist/flibs";
import {IScrollDragHelperConfigVO} from "./IScrollDragHelperConfigVO";
import {ObjectTools} from "@flashist/fcore";

export class ScrollDragHelper extends DragHelper {

    public config: IScrollDragHelperConfigVO;

    constructor(config?: Partial<IScrollDragHelperConfigVO>) {
        super();

        this.config = {};
        if (config) {
            ObjectTools.copyProps(this.config, config);
        }
    }

    protected updateDrag(): void {
        super.updateDrag();

        if (this.config.x) {
            let newX: number = this.lastDragWithShiftLocalX;
            newX = Math.max(newX, this.config.x.min);
            newX = Math.min(newX, this.config.x.max);

            this.view.x = newX;
        }

        if (this.config.y) {
            let newY: number = this.lastDragWithShiftLocalY;
            newY = Math.max(newY, this.config.y.min);
            newY = Math.min(newY, this.config.y.max);

            this.view.y = newY;
        }
    }

}