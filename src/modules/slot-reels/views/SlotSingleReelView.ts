
import { BaseAppView } from "@flashist/appframework/base/views/BaseAppView";
import { ContainersManager } from "@flashist/appframework/containers/managers/ContainersManager";
import { appStorage } from "@flashist/appframework/state/AppStateModule";
import { DeepReadonly } from "@flashist/appframework/state/data/DeepReadableTypings";
import { ArrayTools } from "@flashist/fcore";
import { getInstance, FContainer, getItem, getItemsForType, Graphics, DisplayTools, DisplayObjectContainer, Point } from "@flashist/flibs";
import { ISlotSymbolConfigVO } from "../../slot-symbol-views/data/ISlotSymbolConfigVO";
import { SlotReelsModuleState } from "../data/state/SlotReelsModuleState";
import { SlotReelsModuleViewState } from "../data/state/SlotReelsModuleViewState";
import { IReelSymbolVO } from "../data/symbols/IReelSymbolVO";
import { SlotReelTools } from "../tools/SlotReelTools";
import { SlotReelSymbolView } from "./symbols/SlotReelSymbolView"

export class SlotSingleReelView extends BaseAppView {

    // protected slotConfig: ISlotConfigVO;
    protected reelsState: DeepReadonly<SlotReelsModuleState>;
    protected reelsViewState: DeepReadonly<SlotReelsModuleViewState>;

    public reelIndex: number;

    protected containersManager: ContainersManager;
    // protected slotReelsModel: SlotReelsModel;
    // protected slotReelsViewModel: SlotReelsViewModel;
    // protected slotReelSymbolsViewModel: SlotSymbolsViewModel;
    protected reelTools: SlotReelTools;

    // protected slotReelSymbolsViewModel: SlotReelSymbolsViewModel;

    protected allSymbolsCont: FContainer;
    protected symbolViewContainersList: FContainer[];
    protected extendedSymbolViews: SlotReelSymbolView[];

    protected _extendedSymbolIds: DeepReadonly<IReelSymbolVO[]>;
    private _reelPosition: number;

    protected sizeView: Graphics;

    constructor(reelIndex: number) {
        super(reelIndex);
    }

    protected construction(reelIndex: number): void {
        super.construction(reelIndex);

        this.containersManager = getInstance(ContainersManager);
        // this.slotReelsModel = getInstance(SlotReelsModel);
        // this.slotReelsViewModel = getInstance(SlotReelsViewModel);
        // this.slotReelSymbolsViewModel = getInstance(SlotReelSymbolsViewModel);
        this.reelsState = appStorage().getState<SlotReelsModuleState>();
        this.reelsViewState = appStorage().getState<SlotReelsModuleViewState>();

        this.reelTools = getInstance(SlotReelTools);

        // TEST
        // const tempGraphics: Graphics = new Graphics();
        // this.addChild(tempGraphics);
        // tempGraphics.beginFill(0xFF0000, 0.5);
        // tempGraphics.drawRect(0, 0, 100, 10);

        this.reelIndex = reelIndex;
        // this.slotConfig = getItemsForType<ISlotConfigVO>(SlotConfigType)[0];

        this.sizeView = new Graphics();
        this.addChild(this.sizeView);
        this.sizeView.beginFill(0xFF0000, 0.5);
        // Gap after the last symbol shouldn't contribute to the total height of the columns
        const sizeHeight: number = ((this.reelsState.slot.static.symbols.size.y + this.reelsState.slot.static.symbols.gap) * this.reelsState.slot.static.rowsCount) - this.reelsState.slot.static.symbols.gap;
        this.sizeView.drawRect(
            0,
            0,
            this.reelsState.slot.static.symbols.size.x,
            sizeHeight
        );
        this.sizeView.endFill();
        //
        this.sizeView.lineStyle(1, 0x000000);
        this.sizeView.moveTo(this.reelsState.slot.static.symbols.size.x / 2, 0);
        this.sizeView.lineTo(this.reelsState.slot.static.symbols.size.x / 2, sizeHeight);
        this.sizeView.endFill();
        //
        this.sizeView.alpha = 0;

        this.allSymbolsCont = new FContainer();
        this.addChild(this.allSymbolsCont);

        //
        this.extendedSymbolViews = [];
        //
        this.symbolViewContainersList = [];
        const extendedSymbolsCount: number = this.reelsState.slot.static.rowsCount + (this.reelsState.slot.static.additionalVisibleSymbolsCount * 2);
        for (let rowIndex: number = 0; rowIndex < extendedSymbolsCount; rowIndex++) {
            const tempCont: FContainer = new FContainer();
            this.allSymbolsCont.addChild(tempCont);
            tempCont.y = (this.reelsState.slot.static.symbols.size.y + this.reelsState.slot.static.symbols.gap) * rowIndex;
            //
            this.symbolViewContainersList[rowIndex] = tempCont;

            const tempSymbolView: SlotReelSymbolView = this.reelsState.slot.dynamic.symbolViews[this.reelIndex][rowIndex];

            this.extendedSymbolViews[rowIndex] = tempSymbolView;

            tempCont.addChild(tempSymbolView);
        }
    }

    public get extendedSymbolsData(): DeepReadonly<IReelSymbolVO[]> {
        return this._extendedSymbolIds;
    }

    public set extendedSymbolsData(value: DeepReadonly<IReelSymbolVO[]>) {
        if (ArrayTools.checkIfEqual(this.extendedSymbolsData as any[], value as any)) {
            return;
        }

        this._extendedSymbolIds = value.concat();

        this.commitSymbolsData();
    }

    public get reelPosition(): number {
        return this._reelPosition;
    }
    public set reelPosition(value: number) {
        if (value === this.reelPosition) {
            return;
        }

        this._reelPosition = value;

        this.commitSymbolPositionsData();
    }

    protected commitSymbolsData(): void {

        // First try to find symbols which can be reused for the new extended symbols data,
        // This is needed to prevent cases when symbol views will be changed for the same visual
        // symbol animations, which would cause "breakings" of the animations
        const reusableSymbolViews: SlotReelSymbolView[] = [];
        const extendedSymbolsCount: number = this.extendedSymbolsData.length;
        for (let rowIndex: number = 0; rowIndex < extendedSymbolsCount; rowIndex++) {
            const tempExtendedSymbolData: IReelSymbolVO = this.extendedSymbolsData[rowIndex];

            for (let tempSymbolView of this.extendedSymbolViews) {
                if (tempSymbolView.data === tempExtendedSymbolData) {
                    reusableSymbolViews[rowIndex] = tempSymbolView;
                }
            }
        }
        //
        if (reusableSymbolViews.length > 0) {
            for (let rowIndex: number = 0; rowIndex < extendedSymbolsCount; rowIndex++) {
                const tempReusableSymbolView: SlotReelSymbolView = reusableSymbolViews[rowIndex];
                if (tempReusableSymbolView) {
                    const indexBeforeReusing: number = this.extendedSymbolViews.indexOf(tempReusableSymbolView);
                    // Put another symbol view to the position which will be taken for the reusable case
                    this.extendedSymbolViews[indexBeforeReusing] = this.extendedSymbolViews[rowIndex];
                    // Put the reusable view into the final reusable position
                    this.extendedSymbolViews[rowIndex] = tempReusableSymbolView;
                }
            }
        }

        // Setting up data into symbol views
        for (let rowIndex: number = 0; rowIndex < extendedSymbolsCount; rowIndex++) {
            const tempSymbolView: SlotReelSymbolView = this.extendedSymbolViews[rowIndex];
            tempSymbolView.data = this.extendedSymbolsData[rowIndex];
        }

        this.sortSymbolsByZIndex();
        this.commitSymbolPositionsData();
    }

    protected sortSymbolsByZIndex(): void {
        if (!this.reelsState.slot.static.symbols.zSortEnabled) {
            return;
        }

        const sortedSymbolViews: SlotReelSymbolView[] = this.extendedSymbolViews.concat();
        // Sort the symbol views list to make sure the "lower" displayed views
        // are closer to the beginning of the list than the "higher" displayed ones
        sortedSymbolViews.sort(
            (item1: SlotReelSymbolView, item2: SlotReelSymbolView): number => {
                const symbolConfig1: ISlotSymbolConfigVO = this.reelsState.slot.static.symbols.configs[item1.data.id];
                const symbolConfig2: ISlotSymbolConfigVO = this.reelsState.slot.static.symbols.configs[item2.data.id];

                // Use z index of symbol configs or 0, if the zIndex value is not set
                let result: number = (symbolConfig1.zIndex || 0) - (symbolConfig2.zIndex || 0);
                if (result === 0) {
                    // If there are no difference in z-indexes, then sort by the row position:
                    // symbols stying closer to the bottom should be shown "above" symbols staying closer to the top
                    result = item1.data.position.y - item2.data.position.y;
                }

                return result;
            }
        );

        for (let singleView of sortedSymbolViews) {
            const tempSymbolCont: FContainer = this.symbolViewContainersList[singleView.data.position.y];

            DisplayTools.childRemoveItselfFromParent(tempSymbolCont);
            this.allSymbolsCont.addChild(tempSymbolCont);

            const tempExternalCont: DisplayObjectContainer = this.containersManager.getContainer(singleView.reelSymbolStateConfig.containerId);
            if (tempExternalCont) {
                tempExternalCont.addChild(singleView);

            } else {
                tempSymbolCont.addChild(singleView);
            }
        }
    }

    protected commitSymbolPositionsData(): void {
        // ATTENTION: HARD TO UNDERSTAND LOGIC!!!
        // Multiplying on -1 is needed, because technically speaking,
        // the data-related reel-tapes are "moving" backward,
        // but visually related they are "spinning" forward,
        // because visually they are moving top-down,
        // but data-related their position is going backward,
        // to make sure the next top symbol is the one
        // which is at the prev position in the data-related tape
        let tempShiftPosition: number = (this.reelPosition % 1);
        // This code might be even harder to understand,
        // BUT BELIEVE ME IT'S NEEDED!
        // This code is needed to "handle" the cases of transitions
        // from the end of tape to the beginning of it and vice-versa
        // (those transitions might happen if in some cases reels start spinning backwards, e.g. at the bounce case)
        if (Math.sign(tempShiftPosition) < 0) {
            if (this.reelTools.reelPositionRoundMethod(tempShiftPosition) === -1) {
                tempShiftPosition += 1;
            }

        } else if (Math.sign(tempShiftPosition) > 0) {
            if (this.reelTools.reelPositionRoundMethod(tempShiftPosition) === 1) {
                tempShiftPosition -= 1;
            }
        }
        const reverseRotationShiftPosition: number = -1 * tempShiftPosition;
        const tempVisualShiftY: number = (reverseRotationShiftPosition - this.reelsState.slot.static.additionalVisibleSymbolsCount) * (this.reelsState.slot.static.symbols.size.y + this.reelsState.slot.static.symbols.gap);
        this.allSymbolsCont.y = tempVisualShiftY;

        const tempLocalPosition: Point = new Point();
        for (let singleSymbolView of this.extendedSymbolViews) {
            const defaultSymbolContainer: FContainer = this.symbolViewContainersList[singleSymbolView.data.position.y];
            if (singleSymbolView.parent === defaultSymbolContainer) {
                singleSymbolView.position.set(0, 0);
            } else {
                singleSymbolView.parent.toLocal(defaultSymbolContainer.position, defaultSymbolContainer.parent, tempLocalPosition);
                singleSymbolView.position.set(tempLocalPosition.x, tempLocalPosition.y);
            }
        }
    }

    public forceSymbolsRender(): void {
        this.commitSymbolsData();

        for (let rowIndex: number = 0; rowIndex < this.extendedSymbolsData.length; rowIndex++) {
            // const tempSymbolView: SlotReelSymbolView = this.getSymbolView(rowIndex);
            const tempSymbolView: SlotReelSymbolView = this.extendedSymbolViews[rowIndex];
            tempSymbolView.forceRender();
        }
    }
}