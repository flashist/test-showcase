import {ITutorialStepConfigVO} from "./ITutorialStepConfigVO";

export const TutorialModuleInitialState = {
    tutorial: {
        dynamic: {
            activeStepIds: [] as string[],
            completeStepIds: [] as string[]
        },
        static: {
            steps: {
            } as Record<string, ITutorialStepConfigVO>
        }
    }
};

export interface TutorialModuleSaveState {
    tutorial: {
        dynamic: {
            completeStepIds: string[]
        }
    }
};

export type TutorialModuleState = typeof TutorialModuleInitialState & TutorialModuleSaveState;