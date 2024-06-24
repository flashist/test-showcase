import {BaseAppModule} from "@flashist/appframework/base/modules/BaseAppModule";
import {serviceLocatorAdd} from "@flashist/flibs";
import {GameRendererManagerConfigVO} from "./data/GameRendererManagerConfigVO";
import {RendererManagerConfigVO} from "@flashist/appframework";

export class GameRendererModule extends BaseAppModule {
    init() {
        super.init();

        serviceLocatorAdd(GameRendererManagerConfigVO, {toSubstitute: RendererManagerConfigVO});
    }
}