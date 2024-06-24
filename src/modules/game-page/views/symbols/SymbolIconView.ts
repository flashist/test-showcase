import { appStorage } from "@flashist/appframework/state/AppStateModule";
import { Sprite, FContainer, DisplayTools } from "@flashist/flibs";
import { SlotReelsModuleState } from "../../../slot-reels/data/state/SlotReelsModuleState";
import { DeepReadonly } from "@flashist/appframework/state/data/DeepReadableTypings";
import { ISlotSymbolConfigVO } from "../../../slot-symbol-views/data/ISlotSymbolConfigVO";
import { SlotSymbolViewState } from "../../../slot-symbol-views/data/SlotSymbolViewState";
import { ResizableContainer } from "@flashist/appframework/display/views/resize/ResizableContainer";

export class SymbolIconView extends ResizableContainer {
    protected reelsState: DeepReadonly<SlotReelsModuleState>;
    private _symbolId: string = "";

    protected icon: Sprite;

    protected construction(...args: any[]): void {
        super.construction(...args);

        this.reelsState = appStorage().getState<SlotReelsModuleState>();
    }

    protected commitData(): void {
        super.commitData();

        if (this.icon) {
            DisplayTools.childRemoveItselfFromParent(this.icon);
            this.icon = null;
        }

        if (this.symbolId) {
            const tempSymbolConfig: ISlotSymbolConfigVO = this.reelsState.slot.static.symbols.configs[this.symbolId];
            const spriteId: string = tempSymbolConfig.states[SlotSymbolViewState.NORMAL].id;

            this.icon = Sprite.from(spriteId);
            this.addChild(this.icon);
        }

        this.arrange();
    }

    public get symbolId(): string {
        return this._symbolId;
    }
    public set symbolId(value: string) {
        if (value === this.symbolId) {
            return;
        }

        this._symbolId = value;

        this.commitData();
    }

    protected arrange(): void {
        super.arrange();

        if (this.icon) {
            this.icon.width = this.resizeSize.x;
            this.icon.height = this.resizeSize.y;
        }
    }
}