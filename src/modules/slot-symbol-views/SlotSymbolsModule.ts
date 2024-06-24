
import { BaseAppModule } from "@flashist/appframework/base/modules/BaseAppModule";
import { appStorage } from "@flashist/appframework/state/AppStateModule";
import { serviceLocatorAdd } from "@flashist/flibs";

import { SlotSymbolViewStatesManager } from "./managers/SlotSymbolViewStatesManager";

export class SlotSymbolsModule extends BaseAppModule {

    init(): void {
        super.init();

        // Models
        // serviceLocatorAdd(SlotSymbolsViewModel, { isSingleton: true });

        // Managers
        serviceLocatorAdd(SlotSymbolViewStatesManager, { isSingleton: true, forceCreation: true });
    }
}