import { BaseAppCommand } from "@flashist/appframework/base/commands/BaseAppCommand";
import { FLabel, getInstance, LocaleManager, VAlign } from "@flashist/flibs";
import { TemplateSettings } from "../../../../TemplateSettings";

import * as PIXI from "pixi.js";
import { PrepareFontId } from "../../data/PrepareFontId";
import { TimeoutTools } from "@flashist/flibs/timeout/tools/TimeoutTools";

interface IPrepareFontVO {
    label: FLabel;
    bitmapFontId: string;
}

export class PrepareFontsCommand extends BaseAppCommand {

    protected localeManager: LocaleManager = getInstance(LocaleManager);

    protected async executeInternal() {

        const allUniqueChars: (string | string[])[] = this.localeManager.findAllUniqueCharactersForCurrentLocale();
        allUniqueChars.push(
            ...PIXI.BitmapFont.ALPHANUMERIC,
            ...PIXI.BitmapFont.ASCII
        );
        //
        if (IS_DEV) {
            console.log("allUniqueChars: ", allUniqueChars);
        }

        //
        const prepareLabels: IPrepareFontVO[] = [];
        let tempPrepareData: IPrepareFontVO;
        //
        let tempLabel: FLabel;
        // Noto: 96 White
        tempPrepareData = {
            label: new FLabel({
                fontFamily: TemplateSettings.fonts.mainFont,
                size: 96,
                bold: true,
                color: TemplateSettings.colors.white,
                autosize: true
            }),
            bitmapFontId: PrepareFontId.MAIN_96_WHITE
        };
        prepareLabels.push(tempPrepareData);

        // Noto: 96 White Stroke
        tempPrepareData = {
            label: new FLabel({
                fontFamily: TemplateSettings.fonts.mainFont,
                size: 96,
                bold: true,
                color: TemplateSettings.colors.white,
                stroke: 0x000000,
                strokeThickness: 20,
                valign: VAlign.MIDDLE
            }),
            bitmapFontId: PrepareFontId.MAIN_96_WHITE_BLACK_STROKE
        };
        prepareLabels.push(tempPrepareData);

        // Noto: 48 White Stroke
        tempPrepareData = {
            label: new FLabel({
                fontFamily: TemplateSettings.fonts.mainFont,
                size: 48,
                bold: true,
                color: TemplateSettings.colors.white,
                stroke: 0x000000,
                strokeThickness: 10,
                valign: VAlign.MIDDLE
            }),
            bitmapFontId: PrepareFontId.MAIN_48_WHITE_BLACK_STROKE
        };
        prepareLabels.push(tempPrepareData);

        // Noto: 96 Black
        tempPrepareData = {
            label: new FLabel({
                fontFamily: TemplateSettings.fonts.mainFont,
                bold: true,
                size: 96,
                color: TemplateSettings.colors.black,
                autosize: false,
                fitToSize: true,
                changeFontSizeToFit: true,
                changeFontSizeStepChange: -2,
                wordWrap: true
            }),
            bitmapFontId: PrepareFontId.MAIN_96_BLACK
        };
        prepareLabels.push(tempPrepareData);

        // Noto: 48 Black
        tempPrepareData = {
            label: new FLabel({
                fontFamily: TemplateSettings.fonts.mainFont,
                bold: true,
                size: 48,
                color: TemplateSettings.colors.black,
                autosize: false,
                fitToSize: true,
                changeFontSizeToFit: true,
                changeFontSizeStepChange: -2,
                wordWrap: true
            }),
            bitmapFontId: PrepareFontId.MAIN_48_BLACK
        };
        prepareLabels.push(tempPrepareData);

        // Noto: Yellow 48 Stroke
        tempPrepareData = {
            label: new FLabel({
                fontFamily: TemplateSettings.fonts.mainFont,
                size: 48,
                bold: true,
                color: TemplateSettings.colors.yellow,
                stroke: TemplateSettings.colors.black,
                strokeThickness: 10,
                autosize: true
            }),
            bitmapFontId: PrepareFontId.MAIN_48_YELLOW_BLACK_STROKE
        };
        prepareLabels.push(tempPrepareData);

        for (let singlePrepareData of prepareLabels) {
            PIXI.BitmapFont.from(
                singlePrepareData.bitmapFontId,
                (singlePrepareData.label.engineField as PIXI.Text).style,
                {
                    chars: allUniqueChars
                }
            );

            await TimeoutTools.asyncTimeout(250)
        }

        this.notifyComplete();
    }

}