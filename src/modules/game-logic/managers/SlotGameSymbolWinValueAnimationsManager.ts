import gsap from "gsap";

import { BaseAppManager, ContainersManager, appStorage } from "@flashist/appframework";
import { ArrayTools, ObjectsPool } from "@flashist/fcore";
import { DisplayObjectContainer, DisplayTools, FContainer, getInstance, Point, ServiceLocatorObjectsPool } from "@flashist/flibs";
import { TemplateSettings } from "../../../TemplateSettings";
import { WinCoinAnimationsContainerId } from "../../game-page/data/WinCoinAnimationsContainerId";
import { IconWithTextView } from "../../game-page/views/coins/IconWithTextView";
import { SlotReelsModuleState } from "../../slot-reels/data/state/SlotReelsModuleState";
import { SlotReelTools } from "../../slot-reels/tools/SlotReelTools";
import { ISymbolCoinAnimationVO } from "./ISymbolCoinAnimationVO";
import { CoinsAnimationTargetContainerId } from "../../game-page/data/CoinsAnimationTargetContainerId";
import { TimeoutTools } from "@flashist/flibs/timeout/tools/TimeoutTools";
import { IIconWithTextViewConfigVO } from "../../game-page/views/coins/IIconWithTextViewConfigVO";
import { PrepareFontId } from "../data/PrepareFontId";

enum WinIcons {
    COIN = "Symbol_Coin",
    REMOVE = "RemoveIcon",
    REROLL = "RerollIcon"
}

class WinViewsCont extends FContainer<ISymbolCoinAnimationVO> {
    public valueViews: IconWithTextView[] = [];
    public viewsCont: FContainer;

    protected construction(...args) {
        super.construction(...args);

        this.viewsCont = new FContainer();
        this.addChild(this.viewsCont);
    }
}

export class SlotGameSymbolWinValueAnimationsManager extends BaseAppManager {

    protected reelsState = appStorage().getState<SlotReelsModuleState>();
    protected reelTools: SlotReelTools = getInstance(SlotReelTools);
    // protected winValueViewsPool: ObjectsPool = getInstance(ServiceLocatorObjectsPool);
    protected winValueViewPoolsByTypeMap: { [coinId: string]: ObjectsPool } = {};

    protected containersManager: ContainersManager = getInstance(ContainersManager);

    protected allAnims: WinViewsCont[] = [];

    protected getPool(iconId: string): ObjectsPool {
        let result: ObjectsPool = this.winValueViewPoolsByTypeMap[iconId];
        if (!result) {
            result = new ServiceLocatorObjectsPool();
            this.winValueViewPoolsByTypeMap[iconId] = result;
        }

        return result;
    }

    public async startWinAnimation(winData: ISymbolCoinAnimationVO): Promise<void> {

        let tempLocalPos: Point = new Point();
        const coinAnimationsCont: FContainer = this.containersManager.getContainer(WinCoinAnimationsContainerId);

        const winViewsCont: WinViewsCont = new WinViewsCont();
        coinAnimationsCont.addChild(winViewsCont);
        //
        winViewsCont.data = winData;

        const reelSymbolView: DisplayObjectContainer = this.reelsState.slot.dynamic.symbolViews[winData.x][winData.y];
        winViewsCont.parent.toLocal(
            {
                x: Math.floor(reelSymbolView.width / 2),
                y: Math.floor(reelSymbolView.height / 2)
            },
            reelSymbolView,
            tempLocalPos
        );

        let winAnimationIcons: string[] = [];
        if (winData.removesValue) {
            winAnimationIcons.push(WinIcons.REMOVE);
        }
        if (winData.rerollsValue) {
            winAnimationIcons.push(WinIcons.REROLL);
        }
        if (winData.coinsValue) {
            winAnimationIcons.push(WinIcons.COIN);
        }

        let iconsCount: number = 0;
        for (let singleIconId of winAnimationIcons) {
            let winViewsPool: ObjectsPool = this.getPool(singleIconId);

            const singleWinView: IconWithTextView = winViewsPool.getObject(
                IconWithTextView,
                {
                    icon: {
                        imageId: singleIconId,
                        size: new Point(115, 115)
                    },
                    // label: {
                    //     fontFamily: "NotoSans",
                    //     size: 96,
                    //     bold: true,
                    //     color: TemplateSettings.colors.white,
                    //     autosize: true,
                    //     stroke: 0x000000,
                    //     strokeThickness: 10
                    // }
                    label: {
                        isBitmap: true,

                        fontFamily: PrepareFontId.MAIN_96_WHITE_BLACK_STROKE,
                        size: 96,
                        bold: true,
                        color: TemplateSettings.colors.white,
                        autosize: true,
                        stroke: 0x000000,
                        strokeThickness: 10
                    }
                } as IIconWithTextViewConfigVO
            );
            winViewsCont.viewsCont.addChild(singleWinView);
            //
            winViewsCont.valueViews.push(singleWinView);

            // Prepare to reuse from the pool
            singleWinView.isNeedToDestructOnRemoveFromStage = false;
            // Reset from the previous usage
            singleWinView.alpha = 1;
            //
            singleWinView.data = winData;
            //
            if (singleIconId === WinIcons.COIN) {
                singleWinView.text = winData.coinsValue.toString();
            } else if (singleIconId === WinIcons.REMOVE) {
                singleWinView.text = winData.removesValue.toString();
            } else if (singleIconId === WinIcons.REROLL) {
                singleWinView.text = winData.rerollsValue.toString();
            }

            //
            // singleWinView.pivot.set(
            //     singleWinView.width / 2,
            //     singleWinView.height / 2
            // )
            //
            // singleWinView.x = tempLocalPos.x;
            singleWinView.y = iconsCount * singleWinView.height;

            //
            iconsCount++;
        }

        winViewsCont.pivot.set(
            winViewsCont.width / 2,
            winViewsCont.height / 2
        );
        //
        winViewsCont.x = tempLocalPos.x;
        winViewsCont.y = tempLocalPos.y;

        this.allAnims.push(winViewsCont);
        await this.singleAnimationStart(winViewsCont)
    }

    protected async singleAnimationStart(animation: FContainer): Promise<void> {
        const startPos: Point = new Point(
            animation.x,
            animation.y - 25
        );
        gsap.from(
            animation,
            {
                alpha: 0,

                duration: 0.1,
                ease: "circ.easeOut",
            }
        );
        await gsap.from(
            animation.position,
            {
                x: startPos.x,
                y: startPos.y,

                duration: 0.2,
                ease: "circ.easeOut"
            }
        );
    }

    public async finishAllAnimations(singleAnimCompleteCallback: (winData: ISymbolCoinAnimationVO) => void): Promise<void> {
        const coinAnimationsCont: FContainer = this.containersManager.getContainer(WinCoinAnimationsContainerId);
        const coinsTargetAnimCont: FContainer = this.containersManager.getContainer(CoinsAnimationTargetContainerId);
        const tempLocalPos: Point = coinAnimationsCont.toLocal(new Point(), coinsTargetAnimCont);
        //
        const allFinalAnimPromises: Promise<void>[] = [];
        //
        for (let singleWinView of this.allAnims) {
            allFinalAnimPromises.push(
                this.singleAnimationFinish(singleWinView, tempLocalPos, singleAnimCompleteCallback)
            );
        }

        await Promise.all(allFinalAnimPromises);
    }


    protected async singleAnimationFinish(
        winView: WinViewsCont,
        targetPos: Point, singleAnimCompleteCallback: (winData: ISymbolCoinAnimationVO) => void
    ): Promise<void> {

        await TimeoutTools.asyncTimeout(Math.random() * 200);

        gsap.to(
            winView.position,
            {
                x: targetPos.x,
                y: targetPos.y,

                duration: 0.3,
                ease: "circ.easeOut"
            }
        );

        await gsap.to(
            winView,
            {
                alpha: 0,

                duration: 0.15,
                delay: 0.1,

                ease: "circ.easeIn"
            }

        );

        DisplayTools.childRemoveItselfFromParent(winView);

        for (let singleIconView of winView.valueViews) {
            let tempPool: ObjectsPool = this.getPool(singleIconView.config.icon.imageId);
            tempPool.addObject(singleIconView, IconWithTextView);
        }

        ArrayTools.removeItem(this.allAnims, winView);

        singleAnimCompleteCallback(winView.data);
    }

}