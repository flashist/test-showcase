import {BaseAppCommand} from "@flashist/appframework/base/commands/BaseAppCommand";
import {appStorage} from "@flashist/appframework/state/AppStateModule";
import {GamePageModuleState} from "../data/state/GamePageModuleState";

export class ShowCompanionSymbolInfoPopupCommand extends BaseAppCommand {
    constructor(protected companionIndex: number) {
        super();
    }

    protected executeInternal(): void {
        appStorage().change<GamePageModuleState>()(
            "gamePage.popups.companionSymbolInfo",
            {
                visible: true,
                companionIndex: this.companionIndex
            }
        );

        this.notifyComplete();
    }


}