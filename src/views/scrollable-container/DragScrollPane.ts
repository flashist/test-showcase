import {ScrollPaneConfigVO} from "./ScrollPaneConfigVO";
import {ScrollPane} from "./ScrollPane";
import {ScrollDragHelper} from "./ScrollDragHelper";

export class DragScrollPane<DataType extends object = object> extends ScrollPane<DataType> {

    public dragHelper: ScrollDragHelper;

    protected construction(config?: Partial<ScrollPaneConfigVO>, ...args) {
        super.construction(config, ...args);

        this.dragHelper = new ScrollDragHelper({y: {min: 0, max: 0, start: 0}});
        this.dragHelper.view = this.contentCont;

        this.contentCont.interactive = true;
    }

    destruction() {
        super.destruction();

        if (this.dragHelper) {
            this.dragHelper.destruction();
            this.dragHelper = null;
        }
    }

    protected arrange() {
        super.arrange();

        // Remove mask to correctly calculate sizes
        this.contentCont.mask = null;
        //
        this.dragHelper.config.y.min = this.contentContMask.y + this.contentContMask.height - this.contentCont.height;
        this.dragHelper.config.y.max = 0;
        this.dragHelper.config.y.start = this.dragHelper.config.y.max;

        // Set the mask back
        this.contentCont.mask = this.contentContMask;
    }

    public resetScroll(): void {
        if (this.dragHelper.config.x) {
            this.contentCont.x = this.dragHelper.config.x.start;
        }

        if (this.dragHelper.config.y) {
            this.contentCont.y = this.dragHelper.config.y.start;
        }
    }
}