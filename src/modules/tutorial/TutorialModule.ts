import {BaseAppModule} from "@flashist/appframework/base/modules/BaseAppModule";
import {appStorage} from "@flashist/appframework/state/AppStateModule";
import {
    TutorialModuleInitialState,
    TutorialModuleSaveState,
    TutorialModuleState
} from "./data/state/TutorialModuleState";
import {TutorialManager} from "./managers/TutorialManager";
import {getInstance, serviceLocatorAdd} from "@flashist/flibs";
import {TutorialStepFactory} from "./factories/TutorialStepFactory";
import {TutorialSaveParamId} from "./data/TutorialSaveParamId";
import {LocalStorageManager} from "@flashist/appframework";

export class TutorialModule extends BaseAppModule {

    init(): void {
        super.init();

        appStorage().initializeWith(TutorialModuleInitialState);
        // Load Saved Data
        const storageManager: LocalStorageManager = getInstance(LocalStorageManager);
        let tutorialSaveState: TutorialModuleSaveState = storageManager.getParam(TutorialSaveParamId);
        if (tutorialSaveState) {
            appStorage().initializeWith(tutorialSaveState);
        }

        // Factories
        serviceLocatorAdd(TutorialStepFactory, { isSingleton: true });

        // Managers
        serviceLocatorAdd(TutorialManager, { isSingleton: true, forceCreation: true });
    }

}