import { ResizableContainer } from "@flashist/appframework/display/views/resize/ResizableContainer";
import { AutosizeType, FLabel, getInstance, getText, Graphics } from "@flashist/flibs";
import { TemplateSettings } from "../../../../../TemplateSettings";
import { IRarityConfigVO } from "../../../../game-logic/data/rarity/IRarityConfigVO";
import { RarityId } from "../../../../game-logic/data/rarity/RarityId";
import { GameLogicTools } from "../../../../game-logic/tools/GameLogicTools";
import { NumberTools } from "@flashist/fcore";
import { PrepareFontId } from "../../../../game-logic/data/PrepareFontId";

export class SingleRarityChanceView extends ResizableContainer {

    protected gameLogicTools: GameLogicTools;
    protected bg: Graphics;
    protected label: FLabel;

    protected construction(): void {
        super.construction();

        this.gameLogicTools = getInstance(GameLogicTools);

        // const singleRarityCoef: number = this.gameLogicState.gameLogic.dynamic.finalRarity[singleRarityId];
        // const singleRarityColor: number = RarityColor[singleRarityId];

        this.bg = new Graphics();
        this.addChild(this.bg);

        //
        this.label = new FLabel({
            isBitmap: true,

            fontFamily: PrepareFontId.MAIN_48_WHITE_BLACK_STROKE,
            size: 48,
            bold: true,
            color: TemplateSettings.colors.white,
            stroke: 0x000000,
            strokeThickness: 5,
            autosize: true,
            autosizeType: AutosizeType.WIDTH
        });
        this.addChild(this.label);

        // const minBgWidth: number = singleRarityLabel.width + 50;
        // if (singleRarityGraphics.width < minBgWidth) {
        //     singleRarityGraphics.width = minBgWidth;
        // }

        // singleRarityLabel.x = singleRarityGraphics.x + Math.floor((singleRarityGraphics.width - singleRarityLabel.width) / 2);
        // singleRarityLabel.y = singleRarityGraphics.y + Math.floor((singleRarityGraphics.height - singleRarityLabel.height) / 2);
    }

    protected _rarityId: RarityId;
    public get rarityId(): RarityId {
        return this._rarityId;
    }
    public set rarityId(value: RarityId) {
        this._rarityId = value;

        this.arrange();
    }

    protected _chancesCoef: number;
    public get chancesCoef(): number {
        return this._chancesCoef;
    }
    public set chancesCoef(value: number) {
        this._chancesCoef = value;

        this.commitData();
    }

    protected commitData(): void {
        super.commitData();

        let roundCoef: number = NumberTools.roundTo(this.chancesCoef, 0.001, true);
        roundCoef *= 100;
        // Make sure max 2 digits after dot are allowed
        roundCoef = parseFloat(roundCoef.toFixed(2));

        this.label.text = getText("gamePage.rarityChances", { value: roundCoef });
        this.minSize.x = this.label.width + 50;

        this.arrange();
    }

    protected arrange(): void {
        super.arrange();

        if (!this.rarityId || !this.chancesCoef) {
            return;
        }

        // const singleRarityCoef: number = this.gameLogicState.gameLogic.dynamic.finalRarity[singleRarityId];
        // const singleRarityColor: number = RarityColor[this.rarityId];
        const rarityConfig: IRarityConfigVO = this.gameLogicTools.getRarityConfig(this.rarityId);

        this.bg.clear();
        //
        this.bg.beginFill(rarityConfig.color);
        this.bg.drawRect(0, 0, this.resizeSize.x, this.resizeSize.y);

        // const minBgWidth: number = this.label.width + 50;
        // if (this.bg.width < minBgWidth) {
        //     this.bg.width = minBgWidth;
        // }

        this.label.height = this.resizeSize.y;
        this.label.x = this.bg.x + Math.floor((this.bg.width - this.label.width) / 2);
        this.label.y = this.bg.y + Math.floor((this.bg.height - this.label.height) / 2);
    }

}