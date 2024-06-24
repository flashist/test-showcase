import { BaseAppModule } from "@flashist/appframework/base/modules/BaseAppModule";
import { appStorage } from "@flashist/appframework/state/AppStateModule";
import { serviceLocatorAdd } from "@flashist/flibs";
import { SlotReelSymbolView } from "../slot-reels/views/symbols/SlotReelSymbolView";
import { SlotReelSymbolWrapperAnimView } from "../slot-reels/views/symbols/wrapper-anim/SlotReelSymbolWrapperAnimView";
import { GameSlotReelsModuleInitialState } from "./data/state/GameSlotReelsModuleState";
import { GameSlotReelsModuleViewInitialState } from "./data/state/GameSlotReelsModuleViewState";
import { GameSlotReelSymbolTools } from "./tools/GameSlotReelSymbolTools";
import { GameSlotReelSymbolView } from "./views/symbols/GameSlotReelSymbolView";
import { GameSlotReelSymbolWrapperAnimView } from "./views/symbols/wrapper/GameSlotReelSymbolWrapperAnimView";

export class GameSlotReelsModule extends BaseAppModule {

    init(): void {
        super.init();

        appStorage().initializeWith(GameSlotReelsModuleInitialState);
        appStorage().initializeWith(GameSlotReelsModuleViewInitialState);

        serviceLocatorAdd(GameSlotReelSymbolTools, { isSingleton: true });

        serviceLocatorAdd(GameSlotReelSymbolView, { toSubstitute: SlotReelSymbolView });
        serviceLocatorAdd(GameSlotReelSymbolWrapperAnimView, { toSubstitute: SlotReelSymbolWrapperAnimView });
    }

}