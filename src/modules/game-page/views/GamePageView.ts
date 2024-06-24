import * as PIXI from "pixi.js";

import { BasePageView } from "@flashist/appframework/pages/views/BasePageView";
import {
    DisplayObjectContainer,
    FContainer,
    getInstance,
    getText,
    Graphics,
    Point,
    Rectangle,
    Sprite
} from "@flashist/flibs";

import { TemplateSettings } from "../../../TemplateSettings";
import { ContainersManager } from '@flashist/appframework/containers/managers/ContainersManager';
import { SlotReelsModuleState } from '../../slot-reels/data/state/SlotReelsModuleState';
import { appStateChangeEvent, appStorage } from '@flashist/appframework/state/AppStateModule';
import { DeepReadonly } from '@flashist/appframework/state/data/DeepReadableTypings';
import { SlotSingleReelView } from '../../slot-reels/views/SlotSingleReelView';
import { ReelSymbolAnimationsContainerId } from '../../slot-reels/views/symbols/ReelSymbolAnimationsContainerId';
import { MissionPopupView } from './popup/mission/MissionPopupView';
import { AddSymbolPopupView } from './popup/add-symbol/AddSymbolPopupView';
import { GameLogicModuleState } from '../../game-logic/data/state/GameLogicModuleState';
import { GameLogicTools } from '../../game-logic/tools/GameLogicTools';
import { IconWithTextView } from './coins/IconWithTextView';
import { WinCoinAnimationsContainerId } from '../data/WinCoinAnimationsContainerId';
import { CoinsAnimationTargetContainerId } from '../data/CoinsAnimationTargetContainerId';
import { GameOverPopupView } from './popup/game-over/GameOverPopupView';
import { InventoryPopupView } from "./popup/inventory/InventoryPopupView";
import { GameViewId } from "./GameViewId";
import { SimpleImageButton } from "@flashist/appframework/display/views/button/simple-image-button/SimpleImageButton";
import { MissionBonusPopupView } from "./popup/mission-bonus/MissionBonusPopupView";
import { CompanionSymbolInfoPopupView } from "./popup/companion-symbol-info/CompanionSymbolInfoPopupView";
import { EncyclopediaPopupView } from "./popup/encyclopedia/EncyclopediaPopupView";
import { ConfigSymbolInfoPopupView } from "./popup/config-symbol-info/ConfigSymbolInfoPopupView";
import { SettingsPopupView } from "./popup/settings/SettingsPopupView";
import { PrepareFontId } from "../../game-logic/data/PrepareFontId";

export class GamePageView extends BasePageView {

    protected gameLogicState: DeepReadonly<GameLogicModuleState>;
    protected reelsState: DeepReadonly<SlotReelsModuleState>;
    protected gameLogicTools: GameLogicTools;

    protected reelsImage: Sprite;
    protected reelSymbolsBg: Sprite;

    protected reelsCont: FContainer;
    // protected reelsBg: Sprite;
    // protected reelsBg: DisplayObjectContainer;
    protected reelsRect: Graphics;
    // protected reelsBgTop: Sprite;

    // public settingsBtn: BaseBtn;
    // protected settingsBtn: Sprite;
    public settingsBtn: SimpleImageButton;
    protected settingsBtnBg: Sprite;

    public spinBtn: SimpleImageButton;
    protected spinBtnBg: Sprite;

    // public encyclopediaBtn: BaseBtn;
    // protected encyclopediaBtn: Sprite;
    public encyclopediaBtn: SimpleImageButton;
    protected encyclopediaBtnBg: Sprite;

    public inventoryBtn: SimpleImageButton;
    protected inventoryBtnBg: Sprite;

    // protected coinsCont: FContainer;
    // protected coinsIcon: Sprite;
    // protected coinsLabel: FLabel;
    protected coinsInfoView: IconWithTextView;
    protected coinsAnimTarget: FContainer;

    protected removeInfoView: IconWithTextView;
    protected rerollInfoView: IconWithTextView;


    // protected goalInfoCont: FContainer;
    // protected goalInfoCoinsIcon: Sprite;
    // protected goalInfoLabel: FLabel;
    protected goalInfoView: IconWithTextView;

    protected reelSymbolAnimationsCont: FContainer;
    protected winCoinsAnimationsCont: FContainer;

    protected popupSize: Point;
    protected settingsPopup: SettingsPopupView;
    protected missionPopup: MissionPopupView;
    protected missionBonusPopup: MissionBonusPopupView;
    protected addSymbolPopup: AddSymbolPopupView;
    protected inventoryPopup: InventoryPopupView;
    protected encyclopediaPopup: EncyclopediaPopupView;
    //
    protected companionSymbolInfoPopup: CompanionSymbolInfoPopupView;
    protected configSymbolInfoPopup: ConfigSymbolInfoPopupView;
    //
    protected gameOverPopup: GameOverPopupView;

    protected construction(...args: any[]): void {
        super.construction(...args);

        const containersManager: ContainersManager = getInstance(ContainersManager);

        this.popupSize = new Point();

        // // TEST
        // this.sizeAreaView.visible = true;
        // this.alpha = 0.5;

        this.gameLogicState = appStorage().getState<GameLogicModuleState>();
        this.reelsState = appStorage().getState<SlotReelsModuleState>();

        this.gameLogicTools = getInstance(GameLogicTools);

        // this.settingsBtn = new BaseBtn();
        // this.settingsBtn.hitArea = this.settingsBtn;


        this.reelSymbolsBg = Sprite.from("ReelSymbolsBg");
        this.contentCont.addChild(this.reelSymbolsBg);
        //
        this.reelSymbolsBg.width = 1200;


        this.reelsCont = new FContainer();
        this.contentCont.addChild(this.reelsCont);

        // this.reelsBg = Sprite.from("ReelsBg");
        this.reelsRect = new Graphics();
        this.reelsCont.addChild(this.reelsRect);
        //
        this.reelsRect.beginFill(0xFF0000, 0.5);
        this.reelsRect.drawRect(0, 0, 10, 10);
        this.reelsRect.width = 1150;
        this.reelsRect.height = 920;
        //
        this.reelsRect.alpha = 0;


        const tempReelViewPositions: Point[] = [
            new Point(10, 10),
            new Point(240, 10),
            new Point(470, 10),
            new Point(700, 10),
            new Point(930, 10),
        ];
        // const templateReelViewMasks: Rectangle[] = [
        //     new Rectangle(15, 8, 324, 940),
        //     new Rectangle(347, 8, 324, 940),
        //     new Rectangle(679, 8, 324, 940),
        //     new Rectangle(1011, 8, 324, 940),
        //     new Rectangle(1343, 8, 324, 940)
        // ];
        const templateReelViewMasks: Rectangle[] = [
            new Rectangle(10, 10, 230, 920),
            new Rectangle(240, 10, 230, 920),
            new Rectangle(470, 10, 230, 920),
            new Rectangle(700, 10, 230, 920),
            new Rectangle(930, 10, 230, 920),
        ];
        //
        for (let reelIndex: number = 0; reelIndex < this.reelsState.slot.static.colsCount; reelIndex++) {
            const singleReelView: SlotSingleReelView = getInstance(SlotSingleReelView, reelIndex);
            this.reelsCont.addChild(singleReelView);
            singleReelView.x = tempReelViewPositions[reelIndex].x;
            singleReelView.y = tempReelViewPositions[reelIndex].y;

            //
            const tempMaskRect: Rectangle = templateReelViewMasks[reelIndex];
            const singleReelMask: Graphics = new Graphics();
            this.reelsCont.addChild(singleReelMask);
            singleReelMask.beginFill(0x00FF00, 0.25);
            singleReelMask.drawRect(0, 0, tempMaskRect.width, tempMaskRect.height);
            singleReelMask.x = tempMaskRect.x;
            singleReelMask.y = tempMaskRect.y;
            //
            singleReelView.mask = singleReelMask;
            // singleReelMask.alpha = 0;
        }

        // this.reelsBgTop = Sprite.from("ReelsBgTop");
        // this.reelsCont.addChild(this.reelsBgTop);

        this.reelSymbolAnimationsCont = new FContainer();
        this.reelsCont.addChild(this.reelSymbolAnimationsCont);
        //
        containersManager.addContainer(this.reelSymbolAnimationsCont, ReelSymbolAnimationsContainerId);


        this.reelsImage = Sprite.from("MainScreenBg");
        this.contentCont.addChild(this.reelsImage);
        //
        this.reelsImage.interactive = false;



        this.spinBtnBg = Sprite.from("GlowGold");
        this.contentCont.addChild(this.spinBtnBg);

        this.encyclopediaBtnBg = Sprite.from("GlowWhite");
        this.contentCont.addChild(this.encyclopediaBtnBg);

        this.inventoryBtnBg = Sprite.from("GlowWhite");
        this.contentCont.addChild(this.inventoryBtnBg);

        this.settingsBtnBg = Sprite.from("GlowWhite");
        this.contentCont.addChild(this.settingsBtnBg);

        this.settingsBtn = new SimpleImageButton(
            {
                states: {
                    normal: {
                        imageId: "SettingsBtn"
                    },
                    disabled: {
                        imageId: "SettingsBtn"
                    }
                }
            }
        );
        this.contentCont.addChild(this.settingsBtn);
        //
        this.settingsBtn.width = 128;
        this.settingsBtn.scale.set(this.settingsBtn.scale.x);
        //
        this.settingsBtnBg.scale.set(this.settingsBtnBg.scale.x, this.settingsBtnBg.scale.y);

        this.spinBtn = new SimpleImageButton(
            {
                states: {
                    normal: {
                        imageId: "SpinBtn"
                    },
                    disabled: {
                        imageId: "SpinBtn"
                    }
                }
            }
        );
        this.contentCont.addChild(this.spinBtn);
        //
        // this.spinBtn.width = 345;
        // this.spinBtn.scale.set(this.spinBtn.scale.x);
        //
        containersManager.addContainer(this.spinBtn, GameViewId.SPIN_BUTTON);

        this.encyclopediaBtn = new SimpleImageButton(
            {
                states: {
                    normal: {
                        imageId: "WikiBtn"
                    },
                    disabled: {
                        imageId: "WikiBtn"
                    }
                }
            }
        );
        this.contentCont.addChild(this.encyclopediaBtn);
        //
        // this.encyclopediaBtn.width = 230;
        // this.encyclopediaBtn.scale.set(this.encyclopediaBtn.scale.x);


        this.inventoryBtn = new SimpleImageButton(
            {
                states: {
                    normal: {
                        imageId: "InventoryBtn"
                    },
                    disabled: {
                        imageId: "InventoryBtn"
                    }
                }
            });
        this.contentCont.addChild(this.inventoryBtn);
        //
        // this.inventoryBtn.width = 230;
        // this.inventoryBtn.scale.set(this.inventoryBtn.scale.x);
        //
        containersManager.addContainer(this.inventoryBtn, GameViewId.INVENTORY_BUTTON);


        this.coinsInfoView = new IconWithTextView(
            {
                icon: {
                    imageId: "Symbol_Coin",
                    size: new Point(155, 155),
                },
                // label: {
                //     fontFamily: "NotoSans",
                //     size: 96,
                //     bold: true,
                //     color: TemplateSettings.colors.white,
                //     autosize: true
                // }
                label: {
                    isBitmap: true,

                    fontFamily: PrepareFontId.MAIN_96_WHITE_BLACK_STROKE,
                    size: 128,
                    bold: true,
                    color: TemplateSettings.colors.white,
                    autosize: true
                }
            }
        );
        this.contentCont.addChild(this.coinsInfoView);
        //
        containersManager.addContainer(this.coinsInfoView, GameViewId.REELS_COINS);

        this.coinsAnimTarget = new FContainer();
        this.contentCont.addChild(this.coinsAnimTarget);
        //
        containersManager.addContainer(this.coinsAnimTarget, CoinsAnimationTargetContainerId);


        this.removeInfoView = new IconWithTextView(
            {
                icon: {
                    imageId: "RemoveIcon",
                    size: new Point(64, 64),
                },
                // label: {
                //     fontFamily: "NotoSans",
                //     size: 64,
                //     bold: true,
                //     color: TemplateSettings.colors.white,
                //     autosize: true
                // }
                label: {
                    isBitmap: true,

                    fontFamily: PrepareFontId.MAIN_96_WHITE,
                    size: 64,
                    bold: true,
                    color: TemplateSettings.colors.white,
                    autosize: true
                }
            }
        );
        this.contentCont.addChild(this.removeInfoView);


        this.rerollInfoView = new IconWithTextView(
            {
                icon: {
                    imageId: "RerollIcon",
                    size: new Point(64, 64),
                },
                // label: {
                //     fontFamily: "NotoSans",
                //     size: 64,
                //     bold: true,
                //     color: TemplateSettings.colors.white,
                //     autosize: true
                // }
                label: {
                    isBitmap: true,

                    fontFamily: PrepareFontId.MAIN_96_WHITE,
                    size: 64,
                    bold: true,
                    color: TemplateSettings.colors.white,
                    autosize: true
                }
            }
        );
        this.contentCont.addChild(this.rerollInfoView);


        this.goalInfoView = new IconWithTextView(
            {
                icon: {
                    imageId: "Symbol_Coin",
                    size: new Point(76, 76),
                },
                // label: {
                //     fontFamily: "NotoSans",
                //     size: 48,
                //     bold: true,
                //     color: TemplateSettings.colors.white,
                //     autosize: true
                // }
                label: {
                    isBitmap: true,

                    fontFamily: PrepareFontId.MAIN_96_WHITE_BLACK_STROKE,
                    size: 64,
                    bold: true,
                    color: TemplateSettings.colors.white,
                    autosize: true
                }
            }
        );
        this.contentCont.addChild(this.goalInfoView);
        //
        // this.goalInfoView.alpha = 0.75;


        this.winCoinsAnimationsCont = new FContainer();
        this.contentCont.addChild(this.winCoinsAnimationsCont);
        //
        containersManager.addContainer(this.winCoinsAnimationsCont, WinCoinAnimationsContainerId);

        //
        this.settingsPopup = getInstance(SettingsPopupView);
        this.contentCont.addChild(this.settingsPopup);

        this.missionPopup = getInstance(MissionPopupView);
        this.contentCont.addChild(this.missionPopup);

        this.missionBonusPopup = getInstance(MissionBonusPopupView);
        this.contentCont.addChild(this.missionBonusPopup);

        this.addSymbolPopup = getInstance(AddSymbolPopupView);
        this.contentCont.addChild(this.addSymbolPopup);

        this.inventoryPopup = getInstance(InventoryPopupView);
        this.contentCont.addChild(this.inventoryPopup);

        this.encyclopediaPopup = getInstance(EncyclopediaPopupView);
        this.contentCont.addChild(this.encyclopediaPopup);


        this.companionSymbolInfoPopup = getInstance(CompanionSymbolInfoPopupView);
        this.contentCont.addChild(this.companionSymbolInfoPopup);

        this.configSymbolInfoPopup = getInstance(ConfigSymbolInfoPopupView);
        this.contentCont.addChild(this.configSymbolInfoPopup);


        this.gameOverPopup = getInstance(GameOverPopupView);
        this.contentCont.addChild(this.gameOverPopup);
        // TEST
        // this.messagesPopup.data = appStorage().getState<GameLogicModuleState>().gameLogic.static.missions.day1;


        // // TEST - for screenshots
        // this.spinBtn.visible = false;
        // this.spinBtnBg.visible = false;
        // this.encyclopediaBtn.visible = false;
        // this.encyclopediaBtnBg.visible = false;
        // this.inventoryBtn.visible = false;
        // this.inventoryBtnBg.visible = false;
        // this.settingsBtn.visible = false;
        // this.settingsBtnBg.visible = false;
        // this.goalInfoView.visible = false;
    }

    protected addListeners(): void {
        super.addListeners();

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            appStateChangeEvent<GameLogicModuleState>()("gameLogic.dynamic.coins"),
            this.commitCoinsData
        );

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            appStateChangeEvent<GameLogicModuleState>()("gameLogic.dynamic.removes"),
            this.commitData
        );

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            appStateChangeEvent<GameLogicModuleState>()("gameLogic.dynamic.rerolls"),
            this.commitData
        );

        this.eventListenerHelper.addEventListener(
            this.globalDispatcher,
            appStateChangeEvent<GameLogicModuleState>()("gameLogic.dynamic.missionSpins"),
            this.commitMissionSpinsData
        );
    }

    protected commitCoinsData(): void {
        this.coinsInfoView.text = this.gameLogicState.gameLogic.dynamic.coins.toString();

        this.commitMissionSpinsData();

        this.arrangeMissionInfoViews();
    }

    protected commitMissionSpinsData(): void {
        this.goalInfoView.text = getText(
            "gamePage.goalInfo",
            {
                coins: this.gameLogicTools.getCoinsLeftForActiveMission(),
                spins: this.gameLogicTools.getSpinsLeftForActiveMission()
            }
        );
    }

    protected commitData(): void {
        super.commitData();

        this.commitCoinsData();
        this.commitMissionSpinsData();

        this.removeInfoView.text = this.gameLogicState.gameLogic.dynamic.removes.toString();
        //
        this.removeInfoView.visible = true;
        if (this.gameLogicState.gameLogic.dynamic.removes <= 0) {
            this.removeInfoView.visible = false;
        }

        this.rerollInfoView.text = this.gameLogicState.gameLogic.dynamic.rerolls.toString();
        //
        this.rerollInfoView.visible = true;
        if (this.gameLogicState.gameLogic.dynamic.rerolls <= 0) {
            this.rerollInfoView.visible = false;
        }

        this.arrange();
    }

    protected cachedZeroPos: Point = new Point(0, 0);
    protected cachedReelsBgGlobalPos: Point = new Point();
    protected cachedReelsImageLocalPos: Point = new Point();

    protected arrange(): void {
        super.arrange();

        const reelsBgScaledSize: Point = new Point(
            this.reelsRect.width * this.reelsCont.scale.x,
            this.reelsRect.height * this.reelsCont.scale.y
        );
        this.reelsCont.x = this.contentContReversedResizeSize.x + Math.floor((this.contentContReversedResizeSize.width - this.reelsCont.width) / 2);
        this.reelsCont.y = this.contentContReversedResizeSize.y + Math.floor((this.contentContReversedResizeSize.height - this.reelsCont.height) / 2) - 256;

        this.reelSymbolsBg.x = this.reelsCont.x + Math.floor((this.reelsCont.width - this.reelSymbolsBg.width) / 2);
        this.reelSymbolsBg.y = this.reelsCont.y + Math.floor((this.reelsCont.height - this.reelSymbolsBg.height) / 2);

        //
        // this.reelsBg.toGlobal(this.cachedZeroPos, this.cachedReelsBgGlobalPos);
        this.reelsImage.parent.toLocal(this.cachedZeroPos, this.reelsRect, this.cachedReelsImageLocalPos);
        //
        this.reelsImage.x = this.cachedReelsImageLocalPos.x - 416;
        this.reelsImage.y = this.cachedReelsImageLocalPos.y - 635;

        const spinBtnAvailableRect: Rectangle = new Rectangle(
            this.contentContReversedResizeSize.x,
            this.reelsCont.y + reelsBgScaledSize.y,
            this.contentContReversedResizeSize.width,
            this.contentContReversedResizeSize.height - (this.reelsCont.y + reelsBgScaledSize.y)
        );
        //
        this.spinBtn.x = spinBtnAvailableRect.x + Math.floor((spinBtnAvailableRect.width - this.spinBtn.width) / 2);
        this.spinBtn.y = spinBtnAvailableRect.y + Math.floor((spinBtnAvailableRect.height - this.spinBtn.height) / 2);
        //
        this.spinBtnBg.x = this.spinBtn.x + Math.floor((this.spinBtn.width - this.spinBtnBg.width) / 2);
        this.spinBtnBg.y = this.spinBtn.y + Math.floor((this.spinBtn.height - this.spinBtnBg.height) / 2);

        // this.encyclopediaBtn.x = this.spinBtn.x - this.encyclopediaBtn.width - 85;
        this.encyclopediaBtn.x = Math.floor(this.spinBtn.x + (this.spinBtn.width / 2) - (this.inventoryBtn.width / 2) - 432);
        this.encyclopediaBtn.y = this.spinBtn.y + Math.floor((this.spinBtn.height - this.encyclopediaBtn.height) / 2);
        //
        this.encyclopediaBtnBg.x = this.encyclopediaBtn.x + Math.floor((this.encyclopediaBtn.width - this.encyclopediaBtnBg.width) / 2);
        this.encyclopediaBtnBg.y = this.encyclopediaBtn.y + Math.floor((this.encyclopediaBtn.height - this.encyclopediaBtnBg.height) / 2);

        // this.inventoryBtn.x = this.spinBtn.x + this.spinBtn.width + 85;
        this.inventoryBtn.x = Math.floor(this.spinBtn.x + (this.spinBtn.width / 2) - (this.inventoryBtn.width / 2) + 432);
        this.inventoryBtn.y = this.spinBtn.y + Math.floor((this.spinBtn.height - this.inventoryBtn.height) / 2);
        //
        this.inventoryBtnBg.x = this.inventoryBtn.x + Math.floor((this.inventoryBtn.width - this.inventoryBtnBg.width) / 2);
        this.inventoryBtnBg.y = this.inventoryBtn.y + Math.floor((this.inventoryBtn.height - this.inventoryBtnBg.height) / 2);

        this.settingsBtn.x = this.contentContReversedResizeSize.x + this.contentContReversedResizeSize.width - this.settingsBtn.width - 30;
        this.settingsBtn.y = this.contentContReversedResizeSize.y + 30;
        //
        this.settingsBtnBg.x = this.settingsBtn.x + Math.floor((this.settingsBtn.width - this.settingsBtnBg.width) / 2);
        this.settingsBtnBg.y = this.settingsBtn.y + Math.floor((this.settingsBtn.height - this.settingsBtnBg.height) / 2);

        //
        this.popupSize.x = this.contentContReversedResizeSize.width + 2;
        this.popupSize.y = this.contentContReversedResizeSize.height + 2;
        //
        this.settingsPopup.resize(this.popupSize.x, this.popupSize.y);
        this.missionPopup.resize(this.popupSize.x, this.popupSize.y);
        this.missionBonusPopup.resize(this.popupSize.x, this.popupSize.y);
        this.addSymbolPopup.resize(this.popupSize.x, this.popupSize.y);
        this.inventoryPopup.resize(this.popupSize.x, this.popupSize.y);
        this.encyclopediaPopup.resize(this.popupSize.x, this.popupSize.y);
        //
        this.companionSymbolInfoPopup.resize(this.popupSize.x, this.popupSize.y);
        this.configSymbolInfoPopup.resize(this.popupSize.x, this.popupSize.y);
        //
        this.gameOverPopup.resize(this.popupSize.x, this.popupSize.y);

        this.arrangeMissionInfoViews();
    }

    protected arrangeMissionInfoViews(): void {
        this.coinsInfoView.x = this.reelsCont.x + Math.floor((this.reelsCont.width - this.coinsInfoView.width) / 2);
        this.coinsInfoView.y = this.reelsCont.y - this.coinsInfoView.height - 100;

        this.coinsAnimTarget.x = this.coinsInfoView.x + (this.coinsInfoView.width / 2);
        this.coinsAnimTarget.y = this.coinsInfoView.y + (this.coinsInfoView.height / 2);


        this.removeInfoView.x = this.coinsInfoView.x - this.removeInfoView.width - 100;
        this.removeInfoView.y = this.coinsInfoView.y + Math.floor((this.coinsInfoView.height - this.removeInfoView.height) / 2);

        this.rerollInfoView.x = this.coinsInfoView.x + this.coinsInfoView.width + 100;
        this.rerollInfoView.y = this.coinsInfoView.y + Math.floor((this.coinsInfoView.height - this.rerollInfoView.height) / 2);

        this.goalInfoView.x = this.reelsCont.x + Math.floor((this.reelsCont.width - this.goalInfoView.width) / 2);
        this.goalInfoView.y = this.reelsCont.y + this.reelsCont.height + 32;
    }

}