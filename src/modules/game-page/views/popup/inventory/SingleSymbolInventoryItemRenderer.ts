import {InteractiveEvent, Sprite} from "@flashist/flibs";
import {BaseAppView} from "@flashist/appframework/base/views/BaseAppView";
import {IGameSlotSymbolCompanionVO} from "../../../../game-slot-reels/data/symbols/IGameSlotSymbolCompanionVO";
import {SymbolIconView} from "../../symbols/SymbolIconView";
import {SingleSymbolIventoryItemRendererEvent} from "./SingleSymbolIventoryItemRendererEvent";

export class SingleSymbolInventoryItemRenderer extends BaseAppView<IGameSlotSymbolCompanionVO> {

    protected icon: Sprite;

    protected symbolIcon: SymbolIconView;

    protected construction(...args) {
        super.construction(...args);

        this.interactive = true;
        this.buttonMode = true;

        this.symbolIcon = new SymbolIconView();
        this.addChild(this.symbolIcon);
        //
        this.symbolIcon.resize(200, 200);
    }

    protected commitData(): void {
        super.commitData();

        if (!this.data) {
            return;
        }

        this.symbolIcon.symbolId = this.data.id;

        this.arrange();
    }

    protected addListeners() {
        super.addListeners();

        this.eventListenerHelper.addEventListener(
            this,
            InteractiveEvent.TAP,
            () => {
                this.globalDispatcher.dispatchEvent(SingleSymbolIventoryItemRendererEvent.TAP, this.data);
            }
        )
    }

    // protected gameLogicTools: GameLogicTools;
    //
    // protected symbolInfoView: SingleSymbolItemRenderer;
    // public removeBtn: SimpleImageButton;
    //
    // private _removeAllowed: boolean;
    //
    // protected construction(...args: any[]): void {
    //     super.construction(...args);
    //
    //     this.gameLogicTools = getInstance(GameLogicTools);
    //
    //     this.symbolInfoView = new SingleSymbolItemRenderer();
    //     this.addChild(this.symbolInfoView);
    //
    //     this.removeBtn = new SimpleImageButton({
    //         states: {
    //             normal: {
    //                 imageId: "DeleteBtn"
    //             }
    //         }
    //     });
    //     this.addChild(this.removeBtn);
    //     //
    //     this.removeBtn.width = 128;
    //     this.removeBtn.height = 128;
    // }
    //
    // protected addListeners(): void {
    //     super.addListeners();
    //
    //     this.eventListenerHelper.addEventListener(
    //         this.removeBtn,
    //         InteractiveEvent.DOWN,
    //         () => {
    //             this.globalDispatcher.dispatchEvent(SingleSymbolIventoryItemRendererEvent.REMOVE, this.data)
    //         }
    //     );
    // }
    //
    // protected commitData() {
    //     super.commitData();
    //
    //     if (!this.data) {
    //         return;
    //     }
    //
    //     const tempConfig: IGameSlotSymbolConfigVO = this.gameLogicTools.getSymbolConfigsByIds([this.data.id])[0];
    //     this.symbolInfoView.data = tempConfig;
    //
    //     let removeBtnVisible: boolean = this.removeAllowed;
    //     if (removeBtnVisible) {
    //         if (this.data.id === GameSymbolId.EMPTY) {
    //             removeBtnVisible = false;
    //         }
    //     }
    //     this.removeBtn.visible = removeBtnVisible;
    //
    //     this.arrange();
    // }
    //
    // protected arrange(): void {
    //     super.arrange();
    //
    //     if (!this.data) {
    //         return;
    //     }
    //
    //     this.symbolInfoView.resize(this.resizeSize.x, this.resizeSize.y);
    //
    //     this.removeBtn.x = this.symbolInfoView.x + this.symbolInfoView.width - this.removeBtn.width - 10;
    //     this.removeBtn.y = this.symbolInfoView.y + this.symbolInfoView.height - this.removeBtn.height - 25;
    // }
    //
    // public get removeAllowed(): boolean {
    //     return this._removeAllowed;
    // }
    //
    // public set removeAllowed(value: boolean) {
    //     if (value === this._removeAllowed) {
    //         return;
    //     }
    //
    //     this._removeAllowed = value;
    //
    //     this.commitData();
    // }
}