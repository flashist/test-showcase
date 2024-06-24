import {BaseAppModule} from "@flashist/appframework/base/modules/BaseAppModule";
import {appStorage} from "@flashist/appframework/state/AppStateModule";
import {GameTutorialModuleInitialState} from "./data/state/GameTutorialModuleState";
import {serviceLocatorAdd} from "@flashist/flibs";
import {GameTutorialManager} from "./manager/GameTutorialManager";

export class GameTutorialModule extends BaseAppModule {
    init() {
        super.init();

        appStorage().initializeWith(GameTutorialModuleInitialState);

        serviceLocatorAdd(GameTutorialManager, {isSingleton: true, forceCreation: true});
    }
}