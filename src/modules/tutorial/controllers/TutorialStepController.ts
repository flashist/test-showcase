import { BaseObjectWithGlobalDispatcher } from "@flashist/appframework/base/BaseObjectWithGlobalDispatcher";
import {
    Align,
    AutosizeType,
    DisplayObjectContainer, DisplayTools,
    FApp,
    FContainer,
    FLabel,
    getInstance,
    getText,
    Graphics, InteractiveEvent,
    Rectangle, VAlign
} from "@flashist/flibs";
import { ContainersManager } from "@flashist/appframework/containers/managers/ContainersManager";
import { TutorialContainerId } from "../TutorialContainerId";
import { DeepReadonly } from "@flashist/appframework/state/data/DeepReadableTypings";
import { TutorialModuleState } from "../data/state/TutorialModuleState";
import { appStorage } from "@flashist/appframework/state/AppStateModule";
import { ITutorialStepConfigVO } from "../data/state/ITutorialStepConfigVO";
import { AppMainContainerEvent } from "@flashist/appframework/app/views/AppMainContainerEvent";

import * as PIXI from "pixi.js";
import { TemplateSettings } from "../../../TemplateSettings";
import { PagesModuleState } from "@flashist/appframework/pages/data/state/PagesModuleState";
import { TutorialStepEvent } from "./TutorialStepEvent";
import { Analytics } from "../../analytics/Analytics";
import { AnalyticsEvent } from "../../analytics/AnalyticsEvent";

export class TutorialStepController extends BaseObjectWithGlobalDispatcher {

    protected tutorialState: DeepReadonly<TutorialModuleState>;
    protected containersManager: ContainersManager;

    public stepId: string;
    public stepConfig: DeepReadonly<ITutorialStepConfigVO>;

    protected stepViewContBounds: Rectangle;
    protected stepViewCont: FContainer;
    protected stepBg: Graphics;
    protected stepScaledCont: FContainer;
    protected stepLabel: FLabel;

    protected targetViewHolePadding: number = 0;
    protected stepInfoToViewPadding: number = 20;

    protected targetView: DisplayObjectContainer;
    protected targetViewBounds: Rectangle;
    protected prevTargetViewBounds: Rectangle;

    protected updateTargetViewTimeout: any;

    protected activatePromise: Promise<void>;
    protected activatePromiseResolve: Function;

    protected isActive: boolean;

    protected startTime: number;

    constructor(stepId: string) {
        super(stepId);
    }

    protected construction(stepId: string) {
        super.construction(stepId);

        this.tutorialState = appStorage().getState<TutorialModuleState>();
        this.containersManager = getInstance(ContainersManager);

        this.stepId = stepId;
        this.stepConfig = this.tutorialState.tutorial.static.steps[this.stepId];
    }

    public destruction() {
        super.destruction();

        this.isActive = false;

        if (this.updateTargetViewTimeout) {
            clearTimeout(this.updateTargetViewTimeout);
            this.updateTargetViewTimeout = null;
        }

        if (this.stepViewCont) {
            DisplayTools.childRemoveItselfFromParent(this.stepViewCont);
        }
    }

    protected addListeners() {
        super.addListeners();

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            AppMainContainerEvent.POST_RESIZE,
            this.updateTutorialView
        );

        this.eventListenerHelper.addEventListener(
            FApp.instance.stage,
            InteractiveEvent.DOWN,
            this.onStageTap
        );
    }

    protected onStageTap(): void {
        if (this.stepConfig.minTimeToDisplayMs) {
            if (Date.now() - this.startTime < this.stepConfig.minTimeToDisplayMs) {
                return;
            }
        }

        this.complete();
    }

    public activate(): Promise<void> {
        if (!this.isActive) {
            this.isActive = true;

            Analytics.logEvent(AnalyticsEvent.TUTORIAL_STEP_START, { id: this.stepId });

            this.startTime = Date.now();

            this.activatePromise = new Promise<void>(
                (resolve: Function) => {
                    this.activatePromiseResolve = resolve;
                    this.createContent();
                }
            );
        }

        return this.activatePromise;
    }

    protected complete(): void {
        if (!this.isActive) {
            return;
        }

        Analytics.logEvent(AnalyticsEvent.TUTORIAL_STEP_COMPLETE, { id: this.stepConfig.id });

        this.isActive = false;
        this.activatePromiseResolve();

        this.dispatchEvent(TutorialStepEvent.COMPLETE);
    }

    protected createContent(): void {
        const containersManager: ContainersManager = getInstance(ContainersManager);
        const tutorialCont: FContainer = containersManager.getContainer(TutorialContainerId);

        this.targetView = containersManager.getContainer(this.stepConfig.viewId);
        this.targetViewBounds = new Rectangle();
        this.prevTargetViewBounds = new Rectangle();

        this.stepViewContBounds = new Rectangle();

        this.stepViewCont = new FContainer();
        tutorialCont.addChild(this.stepViewCont);
        //
        this.stepViewCont.interactive = !!this.stepConfig.blocking;

        this.stepBg = new Graphics();
        this.stepViewCont.addChild(this.stepBg);
        //
        this.stepBg.filters = [new PIXI.filters.BlurFilter()];

        this.stepScaledCont = new FContainer();
        this.stepViewCont.addChild(this.stepScaledCont);

        this.stepLabel = new FLabel({
            fontFamily: TemplateSettings.fonts.mainFont,
            size: 72,
            color: TemplateSettings.colors.white,
            bold: true,
            stroke: 0x000000,
            strokeThickness: 10,
            align: this.stepConfig.labelAlign,
            valign: this.stepConfig.labelValign,
            autosize: true,
            autosizeType: AutosizeType.HEIGHT,
            maxAutosizeWidth: 800,
            wordWrap: true
        });
        this.stepScaledCont.addChild(this.stepLabel);
        //
        if (this.stepConfig.textId) {
            this.stepLabel.text = getText(this.stepConfig.textId);
        } else {
            this.stepLabel.visible = false;
        }

        this.updateTutorialView();

        this.updateTargetViewTimeout = setInterval(
            () => {
                this.updateTutorialView();
            },
            100
        );
    }

    protected updateTutorialView(): void {
        if (!this.isActive) {
            return;
        }

        this.targetView.getBounds(false, this.targetViewBounds);

        if (this.prevTargetViewBounds.x === this.targetViewBounds.x &&
            this.prevTargetViewBounds.y === this.targetViewBounds.y &&
            this.prevTargetViewBounds.width === this.targetViewBounds.width &&
            this.prevTargetViewBounds.height === this.targetViewBounds.height) {
            return;
        }

        this.prevTargetViewBounds.x = this.targetViewBounds.x;
        this.prevTargetViewBounds.y = this.targetViewBounds.y;
        this.prevTargetViewBounds.width = this.targetViewBounds.width;
        this.prevTargetViewBounds.height = this.targetViewBounds.height;

        const screenWidth: number = FApp.instance.renderer.width;
        const screenHeight: number = FApp.instance.renderer.height;

        // Graphics
        this.stepBg.clear();
        // Main bg
        this.stepBg.beginFill(0x000000, 0.85);
        this.stepBg.lineTo(screenWidth, 0);
        this.stepBg.lineTo(screenWidth, screenHeight);
        this.stepBg.lineTo(0, screenHeight);
        this.stepBg.lineTo(0, 0);
        this.stepBg.endFill();
        // Holes
        this.stepBg.beginHole();
        this.stepBg.drawRect(
            this.targetViewBounds.x - this.targetViewHolePadding,
            this.targetViewBounds.y - this.targetViewHolePadding,
            this.targetViewBounds.width + this.targetViewHolePadding * 2,
            this.targetViewBounds.height + this.targetViewHolePadding * 2
        );
        this.stepBg.endHole();
        // Transparent bg - to block interactions (if needed to be blocked)
        this.stepBg.beginFill(0x000000, 0.01);
        this.stepBg.lineTo(screenWidth, 0);
        this.stepBg.lineTo(screenWidth, screenHeight);
        this.stepBg.lineTo(0, screenHeight);
        this.stepBg.lineTo(0, 0);
        this.stepBg.endFill();
        //

        const pagesState = appStorage().getState<PagesModuleState>();
        // Content
        //
        const reversedContentWidth: number = screenWidth / pagesState.pages.activePageContentScale.x;
        this.stepLabel.width = reversedContentWidth - 100;
        this.stepLabel.wordWrapWidth = this.stepLabel.width;
        //
        this.stepScaledCont.scale.set(pagesState.pages.activePageContentScale.x, pagesState.pages.activePageContentScale.y);
        //
        // let contX: number = 0;
        let contX: number = Math.floor((screenWidth - this.stepScaledCont.width) / 2);
        // let contX: number = this.targetViewBounds.x + Math.floor((this.prevTargetViewBounds.width - this.stepScaledCont.width) / 2);
        // if (this.stepConfig.align) {
        //     if (this.stepConfig.align === Align.LEFT) {
        //         contX = this.targetViewBounds.x - this.stepScaledCont.width - this.stepInfoToViewPadding;
        //     } else if (this.stepConfig.align === Align.RIGHT) {
        //         contX = this.targetViewBounds.x + this.targetViewBounds.width + this.stepInfoToViewPadding;
        //     }
        // }
        //
        let contY: number = this.targetViewBounds.y + Math.floor((this.prevTargetViewBounds.height - this.stepScaledCont.height) / 2);
        if (this.stepConfig.valign) {
            if (this.stepConfig.valign === VAlign.TOP) {
                contY = this.targetViewBounds.y - this.stepScaledCont.height - this.stepInfoToViewPadding;
            } else if (this.stepConfig.valign === VAlign.BOTTOM) {
                contY = this.targetViewBounds.y + this.targetViewBounds.height + this.stepInfoToViewPadding;
            }
        }

        this.stepScaledCont.x = contX;
        this.stepScaledCont.y = contY;
    }
}