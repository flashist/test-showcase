import { BaseAppView } from "@flashist/appframework/base/views/BaseAppView";
import { ObjectsPool } from "@flashist/fcore";
import { DisplayObjectContainer, DisplayResizeTools, DisplayTools, FContainer, FileType, getInstance, Graphics, LoadResourcesCache, Point, ServiceLocatorObjectsPool, Sprite } from "@flashist/flibs";

import { ISlotSymbolConfigVO } from "../../../slot-symbol-views/data/ISlotSymbolConfigVO";
import { ISlotSymbolStateConfigVO } from "../../../slot-symbol-views/data/ISlotSymbolStateConfigVO";
import { SlotSymbolViewState } from "../../../slot-symbol-views/data/SlotSymbolViewState";
import { SlotTimeoutTools } from "../../../slot-tools/SlotTimeoutTools";
import { IReelSymbolVO } from "../../data/symbols/IReelSymbolVO";
import { SlotReelTools } from "../../tools/SlotReelTools";
import { SlotReelSymbolViewEvent } from "./SlotReelSymbolViewEvent";
import { SlotReelSymbolWrapperAnimType } from "./wrapper-anim/SlotReelSymbolWrapperAnimType";
import { SlotReelSymbolWrapperAnimView } from "./wrapper-anim/SlotReelSymbolWrapperAnimView";

export class SlotReelSymbolView<ReelSymbolDataType extends IReelSymbolVO = IReelSymbolVO> extends BaseAppView<ReelSymbolDataType> {
    // protected slotConfig: ISlotConfigVO;

    protected slotReelTools: SlotReelTools;

    protected _symbolId: string;
    protected processedSymbolId: typeof this._symbolId;

    protected _viewState: string;
    protected processedViewState: typeof this._viewState;

    protected symbolViewCont: FContainer;
    protected symbolView: DisplayObjectContainer;

    protected sizeView: Graphics;

    // protected spineAnimView: Spine;
    // protected spineAnimListener: IAnimationStateListener;

    protected wrapperAnimView: SlotReelSymbolWrapperAnimView;
    // protected wrapperAnimListener: IAnimationStateListener;

    protected _isAnimating: boolean;
    public get isAnimating(): boolean {
        return this._isAnimating;
    }

    protected _curAnimPromise: Promise<void>;
    public get curAnimPromise(): Promise<void> {
        return this._curAnimPromise;
    }
    protected curAnimPromiseResolve: Function;

    protected maxSymbolSize: Point;

    protected objectsPool: ObjectsPool;

    constructor(maxSymbolSize: Point) {
        super(maxSymbolSize);
    }

    protected construction(maxSymbolSize: Point): void {
        super.construction(maxSymbolSize);

        this.maxSymbolSize = maxSymbolSize;

        this.objectsPool = getInstance(ServiceLocatorObjectsPool);
        this.slotReelTools = getInstance(SlotReelTools);

        // DEBUG
        this.sizeView = new Graphics();
        this.addChild(this.sizeView);
        this.sizeView.beginFill(0x0000FF, 0.5);
        this.sizeView.drawRect(
            0,
            0,
            this.maxSymbolSize.x,
            this.maxSymbolSize.y
        );
        this.sizeView.alpha = 0;
        //
        // this.sizeView.alpha = 0.25 + Math.random() * 0.75;

        this.symbolViewCont = new FContainer();
        this.addChild(this.symbolViewCont);
        this.symbolViewCont.x = this.sizeView.x + Math.floor(this.sizeView.width / 2);
        this.symbolViewCont.y = this.sizeView.y + Math.floor(this.sizeView.height / 2);
    }

    public destruction(): void {
        // this.removeCurrentSpineAnim();
        this.removeCurrentWrapperAnim();

        super.destruction();
    }

    public forceRender(): void {
        this.commitViewStateData();
    }

    protected commitViewStateData(): void {
        if (this.data.id == this.processedSymbolId && this.data.viewState === this.processedViewState) {
            return;
        }
        this.processedSymbolId = this.data.id;
        this.processedViewState = this.data.viewState;

        if (this.symbolView) {
            let isNeedToDestroyCurView: boolean = true;
            if (this.reelSymbolStateConfig.type === SlotReelSymbolWrapperAnimType) {
                if (this.wrapperAnimView) {
                    isNeedToDestroyCurView = false;
                }
            }

            if (isNeedToDestroyCurView) {
                // this.removeCurrentSpineAnim();
                this.removeCurrentWrapperAnim();

                DisplayTools.childRemoveItselfFromParent(this.symbolView);
                this.symbolView = null;
            }
        }

        // TODO: change to make sure symbol views can be not only textures (but also different DisplayObject elements)

        if (this.reelSymbolStateConfig.type === FileType.IMAGE) {
            this.symbolView = Sprite.from(this.reelSymbolStateConfig.id);
            // TEMP: do manual alignment by the center of the image. Should be changed with proper visual configuration of symbols
            this.symbolView.pivot.x = Math.floor(this.symbolView.width / 2);
            this.symbolView.pivot.y = Math.floor(this.symbolView.height / 2);

        } else if (this.reelSymbolStateConfig.type === FileType.SPINE) {
            /*this._isAnimating = true;
            this.spineAnimView = this.createSpineAnim();
            this.symbolView = this.spineAnimView;*/

        } else if (this.reelSymbolStateConfig.type === SlotReelSymbolWrapperAnimType) {
            this._isAnimating = true;
            if (!this.wrapperAnimView) {
                this.wrapperAnimView = this.objectsPool.getObject(SlotReelSymbolWrapperAnimView);
            }
            this.setWrapperData();
            this.playWrapperAnim();

            this.symbolView = this.wrapperAnimView;
        }

        this.symbolViewCont.addChild(this.symbolView);

        //
        if (this.maxSymbolSize && this.maxSymbolSize.x && this.maxSymbolSize.y) {
            this.symbolView.scale.set(1);
            DisplayResizeTools.scaleObject(this.symbolView, this.maxSymbolSize.x, this.maxSymbolSize.y);
        }
    }

    public get reelSymbolConfig(): ISlotSymbolConfigVO {
        return this.slotReelTools.getSymbolConfig(this.data.id);
    }

    public get reelSymbolStateConfig(): ISlotSymbolStateConfigVO {
        return this.reelSymbolConfig.states[this.data.viewState] || this.reelSymbolConfig.states[SlotSymbolViewState.NORMAL];
    }


    // - - - - - - - - - - 
    // WRAPPER ANIM
    // - - - - - - - - - -

    protected setWrapperData(): void {
        this.wrapperAnimView.data = {
            symbolConfig: this.reelSymbolConfig,
            stateId: this.data.viewState,
            symbolStateConfig: this.reelSymbolStateConfig,
            reelSymbol: this.data
        };
    }

    protected playWrapperAnim(): void {
        this._curAnimPromise = new Promise(
            (resolve: Function) => {
                this.curAnimPromiseResolve = resolve;

                this.wrapperAnimView.play()
                    .then(
                        () => {
                            this.curAnimPromiseResolve();
                        }
                    )
            }
        )
        //
        this.curAnimPromise.then(
            () => {
                this._isAnimating = false;
                this.emit(SlotReelSymbolViewEvent.STATE_ANIMATION_COMPLETE, this);
            }
        );
    }

    protected removeCurrentWrapperAnim(): void {
        if (!this.wrapperAnimView) {
            return;
        }

        this._isAnimating = false;
        this.curAnimPromiseResolve();

        DisplayTools.childRemoveItselfFromParent(this.wrapperAnimView);

        this.wrapperAnimView = null;
    }

    // - - - - - - - - - - 
    // SPINE ANIM
    // - - - - - - - - - -

    /*protected createSpineAnim(): Spine {
        const spineSourceData: any = LoadResourcesCache.get(this.reelSymbolStateConfig.id)
        const spineAnim: Spine = new Spine(spineSourceData);
        //
        this._curAnimPromise = new Promise(
            (resolve: Function) => {

                this.curAnimPromiseResolve = resolve;

                this.spineAnimListener = {
                    complete: (entry: ITrackEntry) => {
                        // 1 frame timeout is needed to avoid spine-related update error,
                        // when the inner-spine logic tries to reach parent, when there is no parent
                        SlotTimeoutTools.setTimeout(
                            () => {
                                this.curAnimPromiseResolve();

                                this._isAnimating = false;
                                this.emit(SlotReelSymbolViewEvent.STATE_ANIMATION_COMPLETE, this);
                            },
                            0
                        );
                    }
                };
                spineAnim.state.addListener(this.spineAnimListener);
                //
                spineAnim.state.setAnimation(0, this.reelSymbolStateConfig.animId, false);
                // TEMP: do manual alignment by the center of the image. Should be changed with proper visual configuration of symbols

            }
        );

        return spineAnim;
    }

    protected removeCurrentSpineAnim(): void {
        if (!this.spineAnimView) {
            return;
        }

        this._isAnimating = false;
        this.curAnimPromiseResolve();

        this.spineAnimView.autoUpdate = false;
        this.spineAnimView.state.removeListener(this.spineAnimListener);
        DisplayTools.childRemoveItselfFromParent(this.spineAnimView);
        this.spineAnimView.destroy();

        this.spineAnimView = null;
        this.spineAnimListener = null;
    }*/
}