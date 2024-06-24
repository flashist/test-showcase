import { BaseAppModule } from "@flashist/appframework/base/modules/BaseAppModule";
import { TemplateAppModuleInitialState } from "./data/TemplateAppModuleState";
import { appStorage } from "@flashist/appframework/state/AppStateModule";
import { serviceLocatorAdd } from "@flashist/flibs";
import { TemplateAppMainContainer } from "./views/TemplateAppMainContainer";
import { AppMainContainer } from "@flashist/appframework/app/views/AppMainContainer";

export class TemplateAppModule extends BaseAppModule {

    init(): void {
        super.init();

        // Init the app with initial state
        appStorage().initializeWith(TemplateAppModuleInitialState);

        //
        serviceLocatorAdd(TemplateAppMainContainer, { toSubstitute: AppMainContainer });
    }
}