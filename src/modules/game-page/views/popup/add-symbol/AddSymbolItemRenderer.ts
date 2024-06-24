import {InteractiveEvent} from "@flashist/flibs";
import {SingleSymbolItemRenderer} from "../symbols/SingleSymbolItemRenderer";
import {AddSymbolItemRendererEvent} from "./AddSymbolItemRendererEvent";

export class AddSymbolItemRenderer extends SingleSymbolItemRenderer {

    protected construction(...args) {
        super.construction(...args);

        this.interactive = true;
        this.buttonMode = true;
    }

    protected addListeners(): void {
        super.addListeners();

        this.eventListenerHelper.addEventListener(
            this,
            InteractiveEvent.DOWN,
            () => {
                this.globalDispatcher.dispatchEvent(AddSymbolItemRendererEvent.SELECT, this.data)
            }
        );
    }

}