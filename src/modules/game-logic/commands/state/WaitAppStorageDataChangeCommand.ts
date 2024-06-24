import { BaseAppCommand } from "@flashist/appframework/base/commands/BaseAppCommand";
import { appStateChangeEvent, appStorage } from "@flashist/appframework/state/AppStateModule";
import { SlotReelsModuleState } from "../../../slot-reels/data/state/SlotReelsModuleState";

export class WaitAppStorageDataChageCommand extends BaseAppCommand {
    constructor(protected deepKey: string, protected value: any) {
        super();
    }

    guard(): boolean {
        let result: boolean = super.guard();
        if (result) {
            if (this.value == this.getAppStorageValue()) {
                result = false;
            }
        }

        return result;
    }

    protected getAppStorageValue(): any {
        return (appStorage().getValue<any>() as any)(this.deepKey);
    }

    protected executeInternal(): void {
        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            (appStateChangeEvent() as any)(this.deepKey),
            () => {
                if (this.value == this.getAppStorageValue()) {
                    this.notifyComplete();
                }
            }
        )
    }
}