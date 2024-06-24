import { AppMainContainer } from "@flashist/appframework/app/views/AppMainContainer";
import { DisplayObjectContainer, FContainer, getInstance, Graphics, Rectangle } from "@flashist/flibs";
import { TemplateSettings } from "../../../TemplateSettings";
import { ContainersManager } from "@flashist/appframework/containers/managers/ContainersManager";
import { EffectsContainerId } from "../../effects/data/EffectsContainerId";

import * as PIXI from "pixi.js";
import { TutorialContainerId } from "../../tutorial/TutorialContainerId";

export class TemplateAppMainContainer extends AppMainContainer {

    protected testTutorialView: Graphics;

    protected construction(...args) {
        super.construction(...args);

        const containersManager: ContainersManager = getInstance(ContainersManager);

        // Tutorial
        const tutorialCont: FContainer = new FContainer();
        this.addChild(tutorialCont);
        containersManager.addContainer(tutorialCont, TutorialContainerId);

        // Effects
        const effectsCont: FContainer = new FContainer();
        this.addChild(effectsCont);
        containersManager.addContainer(effectsCont, EffectsContainerId);

        // // TEST
        // this.testTutorialView = new Graphics();
        // this.addChild(this.testTutorialView);
        // //
        // this.testTutorialView.filters = [new PIXI.filters.BlurFilter()];

        // TEST
        this.bg.visible = false;
    }

    protected createBg(): DisplayObjectContainer {
        const result: Graphics = super.createBg() as any;

        result.clear();

        result.beginFill(TemplateSettings.colors.black, 1);
        result.drawRect(0, 0, 10, 10);

        return result;
    }

    protected arrange() {
        super.arrange();

        // const holeRect: Rectangle = new Rectangle(
        //     this.resizeSize.x / 2 - 100,
        //     this.resizeSize.y / 2 - 100,
        //     200,
        //     200
        // );
        // //
        // this.testTutorialView.clear();
        // this.testTutorialView.beginFill(0x000000, 0.75);
        // //
        // this.testTutorialView.drawRect(
        //     0,
        //     0,
        //     this.resizeSize.x,
        //     holeRect.y
        // );
        // //
        // this.testTutorialView.drawRect(
        //     0,
        //     holeRect.y + holeRect.height,
        //     this.resizeSize.x,
        //     this.resizeSize.y
        // );
        // //
        // this.testTutorialView.drawRect(
        //     0,
        //     holeRect.y,
        //     holeRect.x,
        //     holeRect.height
        // );
        // //
        // this.testTutorialView.drawRect(
        //     holeRect.x + holeRect.width,
        //     holeRect.y,
        //     this.resizeSize.x,
        //     holeRect.height
        // );
    }
}