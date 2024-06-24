import { BaseObjectWithGlobalDispatcher } from "@flashist/appframework/base/BaseObjectWithGlobalDispatcher";
import { GlobalEventDispatcher } from "@flashist/appframework/globaleventdispatcher/dispatcher/GlobalEventDispatcher";
import { appStorage } from "@flashist/appframework/state/AppStateModule";
import { DeepReadonly } from "@flashist/appframework/state/data/DeepReadableTypings";
import { ObjectTools } from "@flashist/fcore";
import { getInstance } from "@flashist/flibs";
import { ISlotSymbolConfigVO } from "../../slot-symbol-views/data/ISlotSymbolConfigVO";
import { SlotSymbolViewState } from "../../slot-symbol-views/data/SlotSymbolViewState";
import { ISingleReelVO } from "../data/ISingleReelVO";
import { ISlotSingleReelSetVO } from "../data/reels/ISlotSingleReelSetVO";
import { ReelState } from "../data/ReelState";
import { StopMovementDirection } from "../data/spin/movement/position/StopMovementDirection";
import { SlotReelsModuleState } from "../data/state/SlotReelsModuleState";
import { SlotReelsModuleViewState } from "../data/state/SlotReelsModuleViewState";
import { IReelSymbolPositionVO } from "../data/symbols/IReelSymbolPositionVO";
import { IReelSymbolVO } from "../data/symbols/IReelSymbolVO";
import { ISybmolWithTapePositionVO } from "../data/symbols/ISymbolWithTapePositionVO";
import { SlotReelsViewSignal } from "../views/SlotReelsViewSignal";

export class SlotReelTools extends BaseObjectWithGlobalDispatcher {
    // protected reelsModel: SlotReelsModel;
    // protected reelsViewModel: SlotReelsViewModel;
    // // protected slotServerState: ISlotServerStateVO;

    // protected reelSymbolsViewModel: SlotReelSymbolsViewModel = getInstance(SlotReelSymbolsViewModel);

    protected reelsState = appStorage().getState<SlotReelsModuleState>();
    protected reelsViewState = appStorage().getState<SlotReelsModuleViewState>();

    public getAllReelsState(): ReelState {
        let result: ReelState = ReelState.STOPPED;
        for (let singleReelData of this.reelsState.slot.dynamic.reels) {
            if (singleReelData.state !== ReelState.STOPPED) {
                result = ReelState.SPINNING;
            }
        }

        return result;
    }

    public getCurrentReelSet(): DeepReadonly<ISlotSingleReelSetVO> {
        return this.reelsState.slot.dynamic.reelSets[this.reelsState.slot.dynamic.reelSetId];
    }

    public getCurrentNonExtendedSymbols(): IReelSymbolVO[][] {
        const result: IReelSymbolVO[][] = [];

        for (let reelSymbols of this.reelsViewState.slotView.extendedReelSymbolsData) {
            const copySymbols: IReelSymbolVO[] = reelSymbols.concat();
            copySymbols.splice(0, this.reelsState.slot.static.additionalVisibleSymbolsCount);
            copySymbols.splice(copySymbols.length - this.reelsState.slot.static.additionalVisibleSymbolsCount, this.reelsState.slot.static.additionalVisibleSymbolsCount);

            result.push(copySymbols);
        }

        return result;
    }

    public changeSingleReelSymbolIds(reelIndex: number, extendedReelSymbolIds: ISybmolWithTapePositionVO[]): void {
        // We don't need to do the same setting for the not-extended symbols,
        // because the elements of both lists are referencing to the same instances
        // for (let singleExtendedColumn of this.extendedReelSymbolsData) {
        //     for (let singleExtendedSymbol of singleExtendedColumn) {
        //         singleExtendedSymbol.id = extendedReelSymbolIds[singleExtendedSymbol.colIndex][singleExtendedSymbol.rowIndex];
        //     }
        // }
        const prevReelSymbols = this.reelsViewState.slotView.extendedReelSymbolsData[reelIndex];
        // for (let singleCurSymbolData of prevReelSymbols) {
        let reelSymbolsCount: number = prevReelSymbols.length;
        for (let extendedRowIndex: number = 0; extendedRowIndex < reelSymbolsCount; extendedRowIndex++) {
            appStorage().change<SlotReelsModuleViewState>()(`slotView.extendedReelSymbolsData.${reelIndex}.${extendedRowIndex}`,
                {
                    id: extendedReelSymbolIds[extendedRowIndex].id,
                    tapeIndex: extendedReelSymbolIds[extendedRowIndex].tapeIndex,
                    tapePosition: extendedReelSymbolIds[extendedRowIndex].tapePosition,
                    preservingPrevState: extendedReelSymbolIds[extendedRowIndex].preservingPrevState
                }
            );
        }
    }

    /**
     * This method is created to make sure different places in the code
     * use the same reel position rounding approach, if they don't,
     * the whole reel spin behavior / positioning / symbols creation process
     * will be broken.
     * 
     * @param reelPosition 
     * @returns 
     */
    public reelPositionRoundMethod(reelPosition: number): number {
        return Math.round(reelPosition);
    }

    public getSingleExtendedReelPositionSymbols(reelIndex: number, position: number): ISybmolWithTapePositionVO[] {
        // const slotConfig: ISlotConfigVO = getItemsForType<ISlotConfigVO>(SlotConfigType)[0];

        const result: ISybmolWithTapePositionVO[] = [];

        const singleReelData: ISingleReelVO = this.reelsState.slot.dynamic.reels[reelIndex];
        const tempReelTape: DeepReadonly<string[]> = this.getCurrentReelSet().reels[reelIndex];

        position = this.reelPositionRoundMethod(singleReelData.position);
        // Make sure the position we're working with is in the limit of [0; length-of-tape]
        position = this.correctTapePosition(position, tempReelTape.length);

        const extendedSymbolsCount: number = this.reelsState.slot.static.rowsCount + (this.reelsState.slot.static.additionalVisibleSymbolsCount * 2);
        for (let symbolIndex: number = 0; symbolIndex < extendedSymbolsCount; symbolIndex++) {
            let symbolTapePosition: number = position + symbolIndex - this.reelsState.slot.static.additionalVisibleSymbolsCount;
            symbolTapePosition = this.correctTapePosition(symbolTapePosition, tempReelTape.length);

            result[symbolIndex] = {
                id: tempReelTape[symbolTapePosition],
                tapeIndex: reelIndex,
                tapePosition: symbolTapePosition,
                preservingPrevState: false
            }
        }

        return result;
    }

    public getSingleExtendedReelPositionSymbolIdsPreservingPreviousVisibleSymbols(reelIndex: number, position: number, spinDelta: number, previousExtendedSymbols: ISybmolWithTapePositionVO[]): ISybmolWithTapePositionVO[] {
        const newSymbols: ISybmolWithTapePositionVO[] = this.getSingleExtendedReelPositionSymbols(reelIndex, position);

        const result: ISybmolWithTapePositionVO[] = [];

        let minChangingSymbolIndex: number = 0;
        let maxChangingSymbolIndex: number = newSymbols.length;
        if (spinDelta < 0) {
            maxChangingSymbolIndex = Math.abs(spinDelta);
        } else if (spinDelta > 0) {
            minChangingSymbolIndex = newSymbols.length - Math.abs(spinDelta);
        }

        // const slotConfig: ISlotConfigVO = getItemsForType<ISlotConfigVO>(SlotConfigType)[0];
        const extendedSymbolsCount: number = this.reelsState.slot.static.rowsCount + (this.reelsState.slot.static.additionalVisibleSymbolsCount * 2);
        for (let symbolIndex: number = 0; symbolIndex < extendedSymbolsCount; symbolIndex++) {
            if (minChangingSymbolIndex <= symbolIndex && symbolIndex < maxChangingSymbolIndex) {
                result[symbolIndex] = newSymbols[symbolIndex];
            } else {
                // Take previous symbols with regard of the positions delta
                result[symbolIndex] = previousExtendedSymbols[symbolIndex + spinDelta];
                result[symbolIndex].preservingPrevState = true;
            }
        }

        return result;
    }

    public correctTapePosition(position: number, tapeLength: number): number {
        position = position % tapeLength;
        if (position < 0) {
            position += tapeLength;
        }

        return position;
    }

    public getPreStopTapePosition(reelIndex: number, direction: StopMovementDirection): number {
        // const slotServerState: ISlotServerStateVO = getItemsForType<ISlotServerStateVO>(SlotServerStateType)[0];
        // const curSlotRoundServerData: ISlotServerRoundVO = getItem(SlotServerRoundType, slotServerState.roundId);
        // const slotConfig: ISlotConfigVO = getItemsForType<ISlotConfigVO>(SlotConfigType)[0];
        // const stopPosition: number = curSlotRoundServerData.stop.reelPositions[reelIndex];
        const stopPosition: number = this.reelsState.slot.dynamic.stop.positions[reelIndex];

        //  1.  We put position far enough from the stop positions,
        //      to make sure there is enough space for the symbols
        //      to move from the edge of the screen to the reels
        //  2.  + or - depends on the direction of rotation!
        let result: number = stopPosition + this.reelsState.slot.static.rowsCount + this.reelsState.slot.static.additionalVisibleSymbolsCount + 1;
        if (direction === StopMovementDirection.BOTTOM_UP) {
            result = stopPosition - this.reelsState.slot.static.rowsCount - this.reelsState.slot.static.additionalVisibleSymbolsCount - 1;
        }

        return result;
    }

    public changeReelSymbolViewState(reelIndex: number, viewState: string): void {
        // const reelsViewModel: SlotReelsViewModel = getInstance(SlotReelsViewModel);
        // const slotConfig: ISlotConfigVO = getItemsForType<ISlotConfigVO>(SlotConfigType)[0];
        const columnSymbolsData = this.reelsViewState.slotView.extendedReelSymbolsData[reelIndex];

        for (let rowIndex: number = 0; rowIndex < this.reelsState.slot.static.rowsCount; rowIndex++) {
            // Change only VISIBLE symbols on the reels (not including the extended ones)
            const extendedSymbolIndex: number = this.reelsState.slot.static.additionalVisibleSymbolsCount + rowIndex;
            const singleSymbolData: IReelSymbolVO = columnSymbolsData[extendedSymbolIndex];

            // singleSymbolData.viewState = viewState;
            appStorage().change<SlotReelsModuleViewState>()(`slotView.extendedReelSymbolsData.${reelIndex}.${extendedSymbolIndex}.viewState`, viewState);
        }

        const globalDispatcher: GlobalEventDispatcher = getInstance(GlobalEventDispatcher);
        globalDispatcher.dispatchEvent(SlotReelsViewSignal.RENDER_SYMBOLS);
    }

    public setSingleReelSymbolsBasedOnPosition(reelIndex: number, position: number): void {
        const extendedReelSymbols: ISybmolWithTapePositionVO[] = this.getSingleExtendedReelPositionSymbols(reelIndex, position);
        // const reelsViewModel: SlotReelsViewModel = getInstance(SlotReelsViewModel);
        this.changeSingleReelSymbolIds(reelIndex, extendedReelSymbols);
    }

    public setSingleReelSymbolsBasedOnPositionPreservingPreviousVisibleSymbols(reelindex: number, position: number, spinDelta: number, previousExtendedSymbols: ISybmolWithTapePositionVO[]): void {
        const extendedReelSymbolIds: ISybmolWithTapePositionVO[] = this.getSingleExtendedReelPositionSymbolIdsPreservingPreviousVisibleSymbols(reelindex, position, spinDelta, previousExtendedSymbols);
        // const reelsViewModel: SlotReelsViewModel = getInstance(SlotReelsViewModel);
        this.changeSingleReelSymbolIds(reelindex, extendedReelSymbolIds);
    }

    public getSingleReelSymbolIdsFromTapePosition(reelSetId: string, reelIndex: number, position: number): string[] {
        const result: string[] = [];

        // const slotServerConfig: ISlotServerConfigVO = getItemsForType<ISlotServerConfigVO>(SlotServerConfigType)[0];
        const reelTape: DeepReadonly<string[]> = this.reelsState.slot.dynamic.reelSets[reelSetId].reels[reelIndex];

        // const slotConfig: ISlotConfigVO = getItemsForType<ISlotConfigVO>(SlotConfigType)[0];
        for (let rowIndex: number = 0; rowIndex < this.reelsState.slot.static.rowsCount; rowIndex++) {
            let tempSymbolTapePosition: number = position + rowIndex;
            tempSymbolTapePosition = this.correctTapePosition(tempSymbolTapePosition, reelTape.length);

            result[rowIndex] = reelTape[tempSymbolTapePosition];
        }

        return result;
    }

    public getReelSymbolIdsFromTapePositions(reelSetId: string, positions: number[]): string[][] {
        const result: string[][] = [];

        // const slotConfig: ISlotConfigVO = getItemsForType<ISlotConfigVO>(SlotConfigType)[0];
        for (let colIndex: number = 0; colIndex < this.reelsState.slot.static.colsCount; colIndex++) {
            result[colIndex] = this.getSingleReelSymbolIdsFromTapePosition(reelSetId, colIndex, positions[colIndex]);
        }

        return result;
    }

    public convertReelPositionToExtendedReelPosition(position: IReelSymbolPositionVO): IReelSymbolPositionVO {
        return {
            x: position.x,
            y: position.y + this.reelsState.slot.static.additionalVisibleSymbolsCount
        };
    }

    public stopSymbolAnimations(extendedPositions: IReelSymbolPositionVO[]): void {
        for (let singlePosition of extendedPositions) {
            let stopStateId: string = this.reelsState.slot.dynamic.symbolViews[singlePosition.x][singlePosition.y].reelSymbolStateConfig.nextStateId;
            if (!stopStateId) {
                stopStateId = SlotSymbolViewState.NORMAL;
            }

            appStorage().change<SlotReelsModuleViewState>()(`slotView.extendedReelSymbolsData.${singlePosition.x}.${singlePosition.y}.viewState`, stopStateId);
        }

        this.globalDispatcher.dispatchEvent(SlotReelsViewSignal.RENDER_SYMBOLS);
    }

    public getSymbolConfig(symbolId: string): ISlotSymbolConfigVO {
        const reelsState = appStorage().getState<SlotReelsModuleState>();
        const result = ObjectTools.clone(reelsState.slot.static.symbols.defaultConfig);
        ObjectTools.copyProps(result, reelsState.slot.static.symbols.configs[symbolId]);

        return result;
    }

    public getReelSymbol(reelIndex: number, extendedRowIndex: number): IReelSymbolVO {
        return this.reelsViewState.slotView.extendedReelSymbolsData[reelIndex]?.[extendedRowIndex];
    }
}
