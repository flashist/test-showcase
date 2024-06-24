
import { serviceLocatorAdd } from "@flashist/flibs";
import { SlotReelTools } from "./tools/SlotReelTools";

import { SlotSingleReelMediator } from "./views/SlotSingleReelMediator";
import { SlotSingleReelView } from "./views/SlotSingleReelView";
import { ReelSpinMovementCommandsFactory } from "./factories/ReelSpinMovementCommandsFactory";
import { BaseAppModule } from "@flashist/appframework/base/modules/BaseAppModule";
import { appStorage } from "@flashist/appframework/state/AppStateModule";
import { SlotReelsModuleInitialState } from "./data/state/SlotReelsModuleState";
import { SlotGameStateManager } from "../game-logic/managers/SlotGameStateManager";
import { SlotReelsModuleViewInitialState } from "./data/state/SlotReelsModuleViewState";

export class SlotReelsModule extends BaseAppModule {

    init(): void {
        super.init();

        // State
        appStorage().initializeWith(SlotReelsModuleInitialState);
        appStorage().initializeWith(SlotReelsModuleViewInitialState);

        // Models
        // serviceLocatorAdd(SlotReelsModel, { isSingleton: true });
        // serviceLocatorAdd(SlotReelsViewModel, { isSingleton: true });
        // serviceLocatorAdd(SlotReelSymbolsViewModel, { isSingleton: true });

        // Factories
        serviceLocatorAdd(ReelSpinMovementCommandsFactory, { isSingleton: true });

        // Managers
        serviceLocatorAdd(SlotGameStateManager, { isSingleton: true });

        // Tools
        serviceLocatorAdd(SlotReelTools, { isSingleton: true });
        // serviceLocatorAdd(SlotStateTools, { isSingleton: true });

        // Views
        // serviceLocatorAdd(SlotReelsView, { activateeConstructors: [SlotReelsMediator] });
        serviceLocatorAdd(SlotSingleReelView, { activateeConstructors: [SlotSingleReelMediator] });
    }
}