import { serviceLocatorAdd } from "@flashist/flibs";
import { BaseAppModule } from "@flashist/appframework/base/modules/BaseAppModule";
import { appStorage } from "@flashist/appframework/state/AppStateModule";
import { GameLogicModuleInitialState } from "./data/state/GameLogicModuleState";
import { SlotGameStateManager } from "./managers/SlotGameStateManager";
import { TemplateSlotReelsSpinBehaviourCommand } from "./commands/reels/TemplateSlotReelsSpinBehaviourCommand";
import { SlotReelsSpinBehaviourCommand } from "../slot-reels/commands/spin/SlotReelsSpinBehaviourCommand";
import { GameLogicTools } from "./tools/GameLogicTools";
import { GameSymbolInteractionTools } from "./tools/GameSymbolInteractionTools";
import { SlotGameSymbolWinValueAnimationsManager } from "./managers/SlotGameSymbolWinValueAnimationsManager";

export class GameLogicModule extends BaseAppModule {

    init(): void {
        super.init();

        appStorage().initializeWith(GameLogicModuleInitialState);
        // TEST
        (document as any).GameLogicModuleInitialState = GameLogicModuleInitialState;

        //
        // serviceLocatorAdd(HunterSystem, { isSingleton: true });

        // Tools
        serviceLocatorAdd(GameLogicTools, { isSingleton: true });
        serviceLocatorAdd(GameSymbolInteractionTools, { isSingleton: true });

        // Managers
        serviceLocatorAdd(SlotGameStateManager, { isSingleton: true, forceCreation: true });
        serviceLocatorAdd(SlotGameSymbolWinValueAnimationsManager, { isSingleton: true, forceCreation: true });

        // Commands
        serviceLocatorAdd(TemplateSlotReelsSpinBehaviourCommand, { toSubstitute: SlotReelsSpinBehaviourCommand });
    }

    activateCompleteHook(): void {
        super.activateCompleteHook();

        // const system = getInstance(HunterSystem);
        // getInstance(ECSManager).systems.add(system);
    }
}