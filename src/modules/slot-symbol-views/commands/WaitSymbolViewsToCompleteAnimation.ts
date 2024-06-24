
import { BaseAppCommand } from "@flashist/appframework/base/commands/BaseAppCommand";
import { appStorage } from "@flashist/appframework/state/AppStateModule";
import { SlotReelsModuleState } from "../../slot-reels/data/state/SlotReelsModuleState";
import { IReelSymbolPositionVO } from "../../slot-reels/data/symbols/IReelSymbolPositionVO";
import { SlotReelSymbolView } from "../../slot-reels/views/symbols/SlotReelSymbolView";

export class WaitSymbolViewsToCompleteAnimation extends BaseAppCommand {

    constructor(protected symbolPositions: IReelSymbolPositionVO[]) {
        super();
    }

    protected executeInternal(): void {
        const allAnimPromisses: Promise<any>[] = [
            Promise.resolve()
        ];

        const reelsState = appStorage().getState<SlotReelsModuleState>();
        for (let singlePosition of this.symbolPositions) {
            const tempView: SlotReelSymbolView = reelsState.slot.dynamic.symbolViews[singlePosition.x][singlePosition.y];
            if (tempView.isAnimating) {
                allAnimPromisses.push(tempView.curAnimPromise);
            }
        }

        Promise.all(allAnimPromisses)
            .finally(
                () => {
                    this.notifyComplete();
                }
            );
    }
}