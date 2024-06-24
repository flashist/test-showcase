import {IConstructor} from "@flashist/fcore";
import {TutorialStepController} from "../controllers/TutorialStepController";
import {getInstance} from "@flashist/flibs";

export class TutorialStepFactory {
    protected tutorialStepIdsToControllerClassesMap: {[stepId: string]: IConstructor<TutorialStepController>} = {};

    public addTutorialClass(stepId: string, TutorialStepControllerClass: IConstructor<TutorialStepController>): void {
        this.tutorialStepIdsToControllerClassesMap[stepId] = TutorialStepControllerClass;
    }

    public createStepController(stepId: string): TutorialStepController {
        let ControllerClass: IConstructor<TutorialStepController> = this.tutorialStepIdsToControllerClassesMap[stepId];
        if (!ControllerClass) {
            ControllerClass = TutorialStepController;
        }

        const result: TutorialStepController = getInstance(TutorialStepController, stepId);
        return result;
    }
}