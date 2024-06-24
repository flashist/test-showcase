import {BaseAppCommand} from "@flashist/appframework/base/commands/BaseAppCommand";
import {getInstance, Sound, SoundsManager} from "@flashist/flibs";

export class StartBackgroundMusicCommand extends BaseAppCommand {
    protected soundsManager: SoundsManager = getInstance(SoundsManager);

    protected executeInternal(): void {
        let tempSound = this.soundsManager.getSound("BgMusic");
        tempSound.play();

        tempSound.engineSound.on("end", () => {
            tempSound.play();
            tempSound.engineSound.seek(19.22)
        });

        this.notifyComplete();
    }

}