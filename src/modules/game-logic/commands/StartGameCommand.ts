import { getInstance } from "@flashist/flibs";
import { BaseAppCommand } from "@flashist/appframework/base/commands/BaseAppCommand";
import { ChangePageCommand } from "@flashist/appframework/pages/commands/ChangePageCommand";

import { GamePageId } from "../../game-page/data/GamePageId";

export class StartGameCommand extends BaseAppCommand {
    protected executeInternal(): void {
        getInstance(ChangePageCommand, GamePageId)
            .execute()
            .then(
                () => {
                    this.notifyComplete();
                }
            )
    }

}