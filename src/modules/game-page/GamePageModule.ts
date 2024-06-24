import { BaseAppModule } from "@flashist/appframework/base/modules/BaseAppModule";
import { appStorage } from "@flashist/appframework/state/AppStateModule";
import { PagesModuleState } from "@flashist/appframework/pages/data/state/PagesModuleState";
import { GamePageId } from "./data/GamePageId";
import { GamePageView } from "./views/GamePageView";
import { serviceLocatorAdd } from "@flashist/flibs";
import { GamePageMediator } from "./views/GamePageMediator";
import { MissionPopupView } from "./views/popup/mission/MissionPopupView";
import { MissionPopupMediator } from "./views/popup/mission/MissionPopupMediator";
import { AddSymbolPopupView } from "./views/popup/add-symbol/AddSymbolPopupView";
import { AddSymbolPopupMediator } from "./views/popup/add-symbol/AddSymbolPopupMediator";
import { GameOverPopupView } from "./views/popup/game-over/GameOverPopupView";
import { GameOverPopupMediator } from "./views/popup/game-over/GameOverPopupMediator";
import { GamePageModuleInitialState } from "./data/state/GamePageModuleState";
import {InventoryPopupView} from "./views/popup/inventory/InventoryPopupView";
import {InventoryPopupMediator} from "./views/popup/inventory/InventoryPopupMediator";
import {MissionBonusPopupView} from "./views/popup/mission-bonus/MissionBonusPopupView";
import {MissionBonusPopupMediator} from "./views/popup/mission-bonus/MissionBonusPopupMediator";
import {CompanionSymbolInfoPopupView} from "./views/popup/companion-symbol-info/CompanionSymbolInfoPopupView";
import {CompanionSymbolInfoPopupMediator} from "./views/popup/companion-symbol-info/CompanionSymbolInfoPopupMediator";
import {EncyclopediaPopupView} from "./views/popup/encyclopedia/EncyclopediaPopupView";
import {EncyclopediaPopupMediator} from "./views/popup/encyclopedia/EncyclopediaPopupMediator";
import {ConfigSymbolInfoPopupView} from "./views/popup/config-symbol-info/ConfigSymbolInfoPopupView";
import {ConfigSymbolInfoPopupMediator} from "./views/popup/config-symbol-info/ConfigSymbolInfoPopupMediator";
import {SettingsPopupView} from "./views/popup/settings/SettingsPopupView";
import {SettingsPopupMediator} from "./views/popup/settings/SettingsPopupMediator";

export class GamePageModule extends BaseAppModule {

    init(): void {
        super.init();

        appStorage().initializeWith(GamePageModuleInitialState);

        serviceLocatorAdd(GamePageView, { activateeConstructors: [GamePageMediator] });
        serviceLocatorAdd(SettingsPopupView, { activateeConstructors: [SettingsPopupMediator] });
        serviceLocatorAdd(MissionPopupView, { activateeConstructors: [MissionPopupMediator] });
        serviceLocatorAdd(MissionBonusPopupView, { activateeConstructors: [MissionBonusPopupMediator] });
        serviceLocatorAdd(AddSymbolPopupView, { activateeConstructors: [AddSymbolPopupMediator] });
        serviceLocatorAdd(InventoryPopupView, { activateeConstructors: [InventoryPopupMediator] });
        serviceLocatorAdd(CompanionSymbolInfoPopupView, { activateeConstructors: [CompanionSymbolInfoPopupMediator] });
        serviceLocatorAdd(ConfigSymbolInfoPopupView, { activateeConstructors: [ConfigSymbolInfoPopupMediator] });
        serviceLocatorAdd(EncyclopediaPopupView, { activateeConstructors: [EncyclopediaPopupMediator] });
        serviceLocatorAdd(GameOverPopupView, { activateeConstructors: [GameOverPopupMediator] });
    }

    activateCompleteHook(): void {
        super.activateCompleteHook();

        // let pagesModel: PagesModel = getInstance(PagesModel);
        // pagesModel.addPageViewClass(GamePageView, GamePageId);
        appStorage().change<PagesModuleState>()(
            `pages.pageIdToViewClassMap.${GamePageId}`,
            GamePageView
        );
    }
}