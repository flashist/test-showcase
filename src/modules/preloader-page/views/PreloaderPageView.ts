import { TweenLite } from "gsap";

import { Align, FLabel, getText, Graphics, Sprite } from "@flashist/flibs";

import { PreloaderPageViewEvent } from "./PreloaderPageViewEvent";
import { TemplateSettings } from "../../../TemplateSettings";
import { BasePageView } from "@flashist/appframework/pages/views/BasePageView";

export class PreloaderPageView extends BasePageView {

    protected titleLabel: FLabel;
    protected progressLabel: FLabel;

    // protected progressBg: Sprite;
    // protected progressBar: Sprite;
    // protected progressBarMask: Graphics;

    protected _loadingProgress: number = 0;
    private _viewProgress: number = 0;

    protected logo: Sprite;

    protected construction(...args): void {
        super.construction(...args);

        // this.sizeAreaView.alpha = 0.5;

        this.titleLabel = new FLabel({
            fontFamily: TemplateSettings.fonts.mainFont,
            size: 128,
            bold: true,
            color: TemplateSettings.colors.white,
            autosize: true,
            align: Align.CENTER
        });
        // this.contentCont.addChild(this.titleLabel);
        //
        this.titleLabel.text = getText("preloader.title");

        this.progressLabel = new FLabel({
            fontFamily: TemplateSettings.fonts.mainFont,
            bold: true,
            size: 36,
            color: TemplateSettings.colors.white,
            autosize: true
        });
        this.contentCont.addChild(this.progressLabel);


        this.logo = Sprite.from("PreloaderLogo");
        this.contentCont.addChild(this.logo);


        this.viewProgress = 0;
    }

    public get loadingProgress(): number {
        return this._loadingProgress;
    }
    public set loadingProgress(value: number) {
        if (value === this._loadingProgress) {
            return;
        }

        this._loadingProgress = value;

        TweenLite.killTweensOf(this);
        TweenLite.to(
            this,
            0.5,
            {
                viewProgress: this.loadingProgress
            }
        );
    }

    get viewProgress(): number {
        return this._viewProgress;
    }
    set viewProgress(value: number) {
        if (value === this._viewProgress) {
            return;
        }

        this._viewProgress = value;

        this.commitData();

        if (this.viewProgress >= 1) {
            this.emit(PreloaderPageViewEvent.PROGRESS_COMPLETE);
        }
    }

    protected commitData(): void {
        super.commitData();

        // this.progressBarMask.width = this.progressBar.width * this._viewProgress;
        this.progressLabel.text = getText(
            "preloader.progress",
            {
                progress: Math.floor(this.viewProgress * 100)
            }
        );

        this.arrange();
    }

    protected arrange(): void {
        super.arrange();

        this.titleLabel.x = this.contentContReversedResizeSize.x + Math.floor((this.contentContReversedResizeSize.width - this.titleLabel.width) / 2);
        this.titleLabel.y = this.contentContReversedResizeSize.y + Math.floor((this.contentContReversedResizeSize.height - this.titleLabel.height) / 2);

        // this.progressLabel.x = this.contentContReversedResizeSize.x + Math.floor((this.contentContReversedResizeSize.width - this.progressLabel.width) / 2);
        // this.progressLabel.y = this.titleLabel.y + this.titleLabel.height;

        this.logo.x = Math.floor((this.contentContReversedResizeSize.width - this.logo.width) / 2);
        this.logo.y = Math.floor((this.contentContReversedResizeSize.height - this.logo.height) / 2);

        this.progressLabel.x = this.logo.x + Math.floor((this.logo.width - this.progressLabel.width) / 2);
        this.progressLabel.y = this.logo.y + this.logo.height;
        // this.progressLabel.y = this.titleLabel.y + this.titleLabel.height;
    }
}