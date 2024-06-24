import {BaseAppManager} from "@flashist/appframework/base/managers/BaseAppManager";
import {appStorage} from "@flashist/appframework/state/AppStateModule";
import {TutorialModuleSaveState, TutorialModuleState} from "../data/state/TutorialModuleState";
import {ITutorialStepConfigVO} from "../data/state/ITutorialStepConfigVO";
import {DeepReadonly} from "@flashist/appframework/state/data/DeepReadableTypings";
import {TutorialStepController} from "../controllers/TutorialStepController";
import {getInstance} from "@flashist/flibs";
import {ArrayTools, EventListenerHelper} from "@flashist/fcore";
import {TutorialStepEvent} from "../controllers/TutorialStepEvent";
import {TutorialStepFactory} from "../factories/TutorialStepFactory";
import {LocalStorageManager} from "@flashist/appframework";
import {TutorialSaveParamId} from "../data/TutorialSaveParamId";

export class TutorialManager extends BaseAppManager {

    protected tutorialState = appStorage().getState<TutorialModuleState>();
    protected tutorialStepsFactory: TutorialStepFactory = getInstance(TutorialStepFactory);
    protected storageManager: LocalStorageManager = getInstance(LocalStorageManager);

    protected stepsEventListenerHelper: EventListenerHelper = new EventListenerHelper(this);
    protected activeStepControllers: TutorialStepController[] = [];

    public destruction() {
        super.destruction();

        if (this.stepsEventListenerHelper) {
            this.stepsEventListenerHelper.destruction();
            this.stepsEventListenerHelper = null;
        }
    }


    // Save

    protected updateSaveData(): void {
        const newSavedState: TutorialModuleSaveState = {
            tutorial: {
                dynamic: {
                    completeStepIds: this.tutorialState.tutorial.dynamic.completeStepIds.concat()
                }
            }
        };

        this.storageManager.setParam(TutorialSaveParamId, newSavedState);
    }

    // Steps

    public startStep(id: string): Promise<void> {
        if (!this.checkIfStepCanBeStarted(id)) {
            return;
        }

        appStorage().push<TutorialModuleState>()("tutorial.dynamic.activeStepIds", id);

        const stepController: TutorialStepController = this.tutorialStepsFactory.createStepController(id);
        this.addStepListeners(stepController);

        this.activeStepControllers.push(stepController);

        return stepController.activate();
    }

    protected processControllerComplete(stepController: TutorialStepController): void {
        ArrayTools.removeItem(this.activeStepControllers, stepController);
        this.removeStepListeners(stepController);

        // Remove from active steps
        const stepIndex: number = this.tutorialState.tutorial.dynamic.activeStepIds.indexOf(stepController.stepId);
        appStorage().splice<TutorialModuleState>()("tutorial.dynamic.activeStepIds", stepIndex);

        if (stepController.stepConfig.completeSaveStepId) {
            // Add to complete steps
            appStorage().push<TutorialModuleState>()("tutorial.dynamic.completeStepIds", stepController.stepConfig.completeSaveStepId);
        }

        // Update save data after completing steps
        this.updateSaveData();

        //
        stepController.destruction();
    }

    protected addStepListeners(stepController: TutorialStepController): void {
        this.stepsEventListenerHelper.addEventListener(
            stepController,
            TutorialStepEvent.COMPLETE,
            () => {
                this.processControllerComplete(stepController);
            }
        );
    }

    protected removeStepListeners(stepController: TutorialStepController): void {
        this.stepsEventListenerHelper.removeAllListeners(stepController);
    }

    public checkIfStepCanBeStarted(id: string): boolean {
        let result: boolean = true;

        const stepConfig: DeepReadonly<ITutorialStepConfigVO> = this.tutorialState.tutorial.static.steps[id];
        if (!stepConfig) {
            result = false;
        }

        if (result) {
            if (this.checkIfStepActive(id)) {
                result = false;
            }
        }

        if (result) {
            if (this.checkIfStepComplete(id)) {
                result = false;
            }
        }

        if (result) {
            if (stepConfig.requiredCompleteStepIds) {
                for (let singleRequiredStepId of stepConfig.requiredCompleteStepIds) {
                    if (!this.checkIfStepComplete(singleRequiredStepId)) {
                        result = false;
                        break;
                    }
                }
            }
        }

        return result;
    }

    public checkIfStepComplete(id: string): boolean {
        let result: boolean = false;

        if (this.tutorialState.tutorial.dynamic.completeStepIds.indexOf(id) !== -1) {
            result = true;
        }

        return  result;
    }

    public checkIfStepActive(id: string): boolean {
        let result: boolean = false;

        if (this.tutorialState.tutorial.dynamic.activeStepIds.indexOf(id) !== -1) {
            result = true;
        }

        return  result;
    }
}