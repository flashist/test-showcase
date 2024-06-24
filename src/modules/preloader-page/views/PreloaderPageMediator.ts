import {BaseAppMediator} from "@flashist/appframework/base/mediators/BaseAppMediator";
import {LoadGroupName} from "@flashist/appframework/load/LoadGroupName";
import {QueueCommand} from "@flashist/fcore";
import {getInstance, LoadEvent, LoadGroup, LoadManager, WaitGroupLoadingCompleteCommand} from "@flashist/flibs";
import {StartFloorCommand} from "../../game-logic/commands/floors-missions/StartFloorCommand";
import {StartGameCommand} from "../../game-logic/commands/StartGameCommand";

import {PreloaderPageView} from "./PreloaderPageView";
import {PreloaderPageViewEvent} from "./PreloaderPageViewEvent";
import {StartBackgroundMusicCommand} from "../../game-logic/commands/music/StartBackgroundMusicCommand";
import {PrepareFontsCommand} from "../../game-logic/commands/prepare/PrepareFontsCommand";
import {Analytics} from "../../analytics/Analytics";
import {AnalyticsEvent} from "../../analytics/AnalyticsEvent";
import {PrepareGameLoadingGroup} from "../../game-logic/data/PrepareGameLoadingGroup";

export class PreloaderPageMediator extends BaseAppMediator<PreloaderPageView> {

    protected loadManager: LoadManager = getInstance(LoadManager);

    protected initLoadGroup: LoadGroup;

    protected isPrepareStarted: boolean;
    protected isPrepareComplete: boolean;

    onActivatorStart(activator: PreloaderPageView): void {
        super.onActivatorStart(activator);

        this.initLoadGroup = this.loadManager.getGroup(LoadGroupName.INIT);
        this.eventListenerHelper.addEventListener(
            this.initLoadGroup,
            LoadEvent.PROGRESS,
            this.onLoaderProgress
        );

        this.eventListenerHelper.addEventListener(
            this.activator,
            PreloaderPageViewEvent.PROGRESS_COMPLETE,
            this.onViewProgressComplete
        );

        getInstance(WaitGroupLoadingCompleteCommand, PrepareGameLoadingGroup)
            .execute()
            .then(
                () => {
                    this.prepareGame();
                }
            )

        this.onLoaderProgress();
    }

    protected onLoaderProgress(): void {
        Analytics.logEvent(AnalyticsEvent.PRELOADER_PROGRESS, {progress: this.initLoadGroup.progress});

        let prepareCompleteCoef: number = 0.9;
        if (this.isPrepareComplete) {
            prepareCompleteCoef = 1;
        }

        this.activator.loadingProgress = this.initLoadGroup.progress * prepareCompleteCoef;
    }

    protected async prepareGame(): Promise<void> {
        if (this.isPrepareStarted) {
            return;
        }
        this.isPrepareStarted = true;

        await getInstance(PrepareFontsCommand)
            .execute();

        this.isPrepareComplete = true;
        this.onLoaderProgress();
    }

    private async onViewProgressComplete() {
        Analytics.logEvent(AnalyticsEvent.GAME_LOADED);

        // IMPORTANT: this code is for the fast-development prpose only,
        // in the final version start of game will be done by selecting levels
        await new QueueCommand([
            getInstance(StartBackgroundMusicCommand),
            getInstance(StartFloorCommand, "floor1"),
            getInstance(StartGameCommand),
        ]).execute();
    }
}

