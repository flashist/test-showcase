import {getInstance} from "@flashist/flibs";
import gsap from "gsap";
import {
    SlotReelSymbolWrapperAnimView
} from "../../../../slot-reels/views/symbols/wrapper-anim/SlotReelSymbolWrapperAnimView";
import {GameSlotSymbolViewState} from "../../../data/symbols/GameSlotSymbolViewState";
import {GameSymbolId} from "../../../data/symbols/GameSymbolId";
import {IGameSlotSymbolCompanionVO} from "../../../data/symbols/IGameSlotSymbolCompanionVO";
import {GameSlotReelSymbolTools} from "../../../tools/GameSlotReelSymbolTools";
import {NumberTools} from "@flashist/fcore";

export class GameSlotReelSymbolWrapperAnimView extends SlotReelSymbolWrapperAnimView {

    protected slotReelSymbolTools: GameSlotReelSymbolTools = getInstance(GameSlotReelSymbolTools);

    protected getSpriteId(): string {
        let result: string = super.getSpriteId();

        const reelSymbolCompanionData: IGameSlotSymbolCompanionVO = this.slotReelSymbolTools.getReelSymbolCompanionData(this.data.reelSymbol.tapeIndex, this.data.reelSymbol.tapePosition);
        if (reelSymbolCompanionData) {

            const diceIds: string[] = [GameSymbolId.THREE_SIDED_DIE, GameSymbolId.FIVE_SIDED_DIE];
            if (diceIds.indexOf(this.data.symbolConfig.id) !== -1) {
                if (reelSymbolCompanionData.lastWinActionRandomValue) {
                    if (this.data.symbolConfig.id === GameSymbolId.THREE_SIDED_DIE) {
                        result = `Symbol_Die_D3_${reelSymbolCompanionData.lastWinActionRandomValue}`;

                    } else if (this.data.symbolConfig.id === GameSymbolId.FIVE_SIDED_DIE) {
                        result = `Symbol_Die_D5_${reelSymbolCompanionData.lastWinActionRandomValue}`;
                    }
                }
            }
        }

        return result;
    }

    public play(): Promise<void> {
        this.applyDirectionData();

        let result: Promise<void>;
        if (this.data.stateId === GameSlotSymbolViewState.INTERACTION) {
            result = this.playInteractionAnim();
        } else if (this.data.stateId === GameSlotSymbolViewState.DESTROYING) {
            result = this.playDestroyingAnim();
        }

        return result;
    }

    protected async playDestroyingAnim(): Promise<void> {
        return new Promise<void>(
            (resolve: Function) => {
                gsap.to(
                    this.contentCont,
                    {
                        alpha: 0,

                        duration: 0.25,
                        ease: "circ.easeInOut",

                        onComplete: () => {
                            resolve();
                        }
                    }
                );
            }
        );
    }

    protected async playInteractionAnim(): Promise<void> {
        return new Promise<void>(
            (resolve: Function) => {

                // return super.play();
                gsap.to(
                    this.contentCont.scale,
                    {
                        x: 0.75,
                        y: 0.75,

                        duration: 0.15,
                        ease: "circ.easeInOut",
                        yoyo: true,
                        repeat: 1,

                        onComplete: () => {
                            resolve();
                        }
                    }
                );
            }
        );
    }

    protected async applyDirectionData(): Promise<void> {
        const bowIds: string[] = [GameSymbolId.BOW_WOODEN, GameSymbolId.BOW_SILVER, GameSymbolId.BOW_GOLDEN];
        if (bowIds.indexOf(this.data.symbolConfig.id) === -1) {
            return;
        }

        const reelSymbolCompanionData: IGameSlotSymbolCompanionVO = this.slotReelSymbolTools.getReelSymbolCompanionData(this.data.reelSymbol.tapeIndex, this.data.reelSymbol.tapePosition);
        let randDirection: number = reelSymbolCompanionData.lastWinActionRandomNumber * (Math.PI * 2);
        // let directionRad: number = NumberTools.roundTo(randDirection, Math.PI / 4);
        const radiansStep: number = (Math.PI / 4);
        let directionRad: number = Math.floor(randDirection / radiansStep) * radiansStep;

        // BOW-symbols have initial rotatin from the 0 rotation, so we need to apply additional direction shift,
        // to make the symbols look in the right direction
        if (bowIds.indexOf(this.data.symbolConfig.id) !== -1) {
            directionRad += radiansStep;
        }

        this.contentCont.rotation = directionRad;
    }

    protected applyDiceData(): void {

    }
}