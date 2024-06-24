import { serviceLocatorAdd } from "@flashist/flibs";
import { BaseAppModule } from "@flashist/appframework/base/modules/BaseAppModule";
import { PagesModuleState } from "@flashist/appframework/pages/data/state/PagesModuleState";
import { appStorage } from "@flashist/appframework/state/AppStateModule";
import { PreloaderPageId } from "./data/PreloaderPageId";

import { PreloaderPageMediator } from "./views/PreloaderPageMediator";
import { PreloaderPageView } from "./views/PreloaderPageView";

export class PreloaderPageModule extends BaseAppModule {

    init(): void {
        super.init();

        serviceLocatorAdd(PreloaderPageView, { activateeConstructors: [PreloaderPageMediator] });
    }

    activateCompleteHook(): void {
        super.activateCompleteHook();

        appStorage().change<PagesModuleState>()(
            `pages.pageIdToViewClassMap.${PreloaderPageId}`,
            PreloaderPageView
        );
    }
}