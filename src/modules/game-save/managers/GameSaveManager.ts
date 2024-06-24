import {BaseAppManager} from "@flashist/appframework/base/managers/BaseAppManager";
import {appStateChangeEvent, appStorage} from "@flashist/appframework/state/AppStateModule";
import {GameLogicModuleState} from "../../game-logic/data/state/GameLogicModuleState";
import {LocalStorageManager} from "@flashist/appframework";
import {getInstance} from "@flashist/flibs";
import {TutorialModuleSaveState} from "../../tutorial/data/state/TutorialModuleState";
import {TutorialSaveParamId} from "../../tutorial/data/TutorialSaveParamId";
import {GameSaveStorageVO} from "../data/state/GameSaveStorageInitialVO";
import {GameSaveParamId} from "../data/GameSaveParamId";

export class GameSaveManager extends BaseAppManager {

    protected storageManager: LocalStorageManager = getInstance(LocalStorageManager);

    protected gameLogicState = appStorage().getState<GameLogicModuleState>();

    protected addListeners() {
        super.addListeners();

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            appStateChangeEvent<GameLogicModuleState>()("gameLogic.dynamicNotResettable.openSymbolIds"),
            this.updateSaveData
        );
    }

    protected updateSaveData(): void {
        const newSavedState: GameSaveStorageVO = {
            gameLogic: {
                dynamicNotResettable: {
                    openSymbolIds: this.gameLogicState.gameLogic.dynamicNotResettable.openSymbolIds.concat()
                }
            }
        };

        this.storageManager.setParam(GameSaveParamId, newSavedState);
    }
}