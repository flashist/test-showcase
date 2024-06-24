import {BaseAppModule} from "@flashist/appframework/base/modules/BaseAppModule";
import {getInstance, serviceLocatorAdd} from "@flashist/flibs";
import {GameSaveManager} from "./managers/GameSaveManager";
import {appStorage} from "@flashist/appframework/state/AppStateModule";
import {TutorialModuleInitialState, TutorialModuleSaveState} from "../tutorial/data/state/TutorialModuleState";
import {LocalStorageManager} from "@flashist/appframework";
import {TutorialSaveParamId} from "../tutorial/data/TutorialSaveParamId";
import {GameSaveParamId} from "./data/GameSaveParamId";
import {GameSaveStorageVO} from "./data/state/GameSaveStorageInitialVO";

export class GameSaveModule extends BaseAppModule {

    init() {
        super.init();

        serviceLocatorAdd(GameSaveManager, {isSingleton: true, forceCreation: true});

        // Load Saved Data
        const storageManager: LocalStorageManager = getInstance(LocalStorageManager);
        let gameSaveData: GameSaveStorageVO = storageManager.getParam(GameSaveParamId);
        if (gameSaveData) {
            appStorage().initializeWith(gameSaveData);
        }
    }
}