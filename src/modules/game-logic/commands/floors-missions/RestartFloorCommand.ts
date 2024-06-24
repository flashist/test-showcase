import {BaseAppCommand} from "@flashist/appframework/base/commands/BaseAppCommand";
import {FContainer, getInstance} from "@flashist/flibs";
import {ChangePageCommand} from "@flashist/appframework/pages/commands/ChangePageCommand";
import {appStorage} from "@flashist/appframework/state/AppStateModule";
import {GameLogicModuleState} from "../../data/state/GameLogicModuleState";
import {StartFloorCommand} from "./StartFloorCommand";
import {StartGameCommand} from "../StartGameCommand";
import {ContainersManager} from "@flashist/appframework/containers/managers/ContainersManager";
import {EffectsContainerId} from "../../../effects/data/EffectsContainerId";
import {SplashEffectView} from "../../../effects/views/SplashEffectView";
import {TemplateSettings} from "../../../../TemplateSettings";
import {GamePageModuleState} from "../../../game-page/data/state/GamePageModuleState";
import {ShowMissionPopupCommand} from "./ShowMissionPopupCommand";

export class RestartFloorCommand extends BaseAppCommand {
    constructor(protected floorId: string) {
        super();
    }

    protected async executeInternal(): Promise<void> {
        const containersManager: ContainersManager = getInstance(ContainersManager);
        const effectsCont: FContainer = containersManager.getContainer(EffectsContainerId);
        const splash: SplashEffectView = new SplashEffectView({color: TemplateSettings.colors.white});
        effectsCont.addChild(splash);
        //
        await splash.show();

        appStorage().change<GamePageModuleState>()("gamePage.popups.gameOver", false);

        await getInstance(ChangePageCommand, "")
            .execute();

        await new StartFloorCommand(this.floorId)
            .execute();

        await getInstance(StartGameCommand)
            .execute();

        await splash.hide();

        this.notifyComplete();
    }
}