import {BaseAppCommand} from "@flashist/appframework/base/commands/BaseAppCommand";
import {appStorage} from "@flashist/appframework/state/AppStateModule";
import {GamePageModuleState} from "../data/state/GamePageModuleState";

export class ShowConfigSymbolInfoPopupCommand extends BaseAppCommand {
    constructor(protected symbolId: string) {
        super();
    }

    protected executeInternal(): void {
        appStorage().change<GamePageModuleState>()(
            "gamePage.popups.configSymbolInfo",
            {
                visible: true,
                symbolId: this.symbolId
            }
        );

        this.notifyComplete();
    }


}