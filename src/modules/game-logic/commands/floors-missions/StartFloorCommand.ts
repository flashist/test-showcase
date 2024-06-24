import { BaseAppCommand } from "@flashist/appframework/base/commands/BaseAppCommand";
import { appStorage } from "@flashist/appframework/state/AppStateModule";
import { getInstance } from "@flashist/flibs";
import { GameSymbolId } from "../../../game-slot-reels/data/symbols/GameSymbolId";
import { GameSlotReelSymbolTools } from "../../../game-slot-reels/tools/GameSlotReelSymbolTools";
import { GameLogicModuleState } from "../../data/state/GameLogicModuleState";
import { GameLogicTools } from "../../tools/GameLogicTools";
import { StartMissionCommand } from "./StartMissionCommand";
import { ResetFloorDataCommand } from "./ResetFloorDataCommand";
import { InitReelsCommand } from "../../../slot-reels/commands/InitReelsCommand";
import { PrepareReelSetForSpinCommand } from "../reels/PrepareReelSetForSpinCommand";
import { ShowMissionPopupCommand } from "./ShowMissionPopupCommand";
import { IFloorConfigVO } from "../../data/state/IFloorConfigVO";
import { IMissionConfigVO } from "../../data/state/IMissionConfigVO";
import { RarityId } from "../../data/rarity/RarityId";
import { ArrayTools } from "@flashist/fcore";
import { IGameSlotSymbolConfigVO } from "../../../game-slot-reels/data/symbols/IGameSlotSymbolConfigVO";
import { DeepReadonly } from "@flashist/appframework/state/data/DeepReadableTypings";
import { Analytics } from "../../../analytics/Analytics";
import { AnalyticsEvent } from "../../../analytics/AnalyticsEvent";
import { GameViewId } from "../../../game-page/views/GameViewId";

export class StartFloorCommand extends BaseAppCommand {

    protected gameLogicTools: GameLogicTools = getInstance(GameLogicTools);
    protected gameSymbolTools: GameSlotReelSymbolTools = getInstance(GameSlotReelSymbolTools);

    constructor(protected floorId: string) {
        super();
    }

    protected async executeInternal(): Promise<void> {
        Analytics.logEvent(AnalyticsEvent.FLOOR_START, { id: this.floorId });

        await new ResetFloorDataCommand()
            .execute();

        // Prepare the game to start the new floor from the scratch
        appStorage().change<GameLogicModuleState>()("gameLogic.dynamic", { floorId: this.floorId, coins: 1 });

        const gameLogicState = appStorage().getState<GameLogicModuleState>();
        let startSymbolIds: string[] = []
        //
        startSymbolIds.push(...gameLogicState.gameLogic.static.reels.defaultSymbols);

        // TEST: all symbols 20x per each
        const gameSymbolIds: string[] = Object.values(GameSymbolId);
        // startSymbolIds = gameSymbolIds.slice(0, 20);
        // startSymbolIds = gameSymbolIds.slice(20, 40);
        // startSymbolIds = gameSymbolIds.slice(40, 60);
        // startSymbolIds = gameSymbolIds.slice(60, 80);
        // startSymbolIds = gameSymbolIds.slice(80, 100);
        // startSymbolIds = gameSymbolIds.slice(100, 120);
        // startSymbolIds = gameSymbolIds.slice(120, 140);
        // startSymbolIds = gameSymbolIds.slice(140, 160);

        // TEST
        // startSymbolIds = [GameSymbolId.ANCHOR, GameSymbolId.ANCHOR, GameSymbolId.ANCHOR, GameSymbolId.ANCHOR, GameSymbolId.ANCHOR, GameSymbolId.ANCHOR, GameSymbolId.ANCHOR, GameSymbolId.ANCHOR, GameSymbolId.ANCHOR, GameSymbolId.ANCHOR, GameSymbolId.ANCHOR, GameSymbolId.ANCHOR, GameSymbolId.ANCHOR, GameSymbolId.ANCHOR, GameSymbolId.ANCHOR, GameSymbolId.ANCHOR, GameSymbolId.ANCHOR, GameSymbolId.ANCHOR, GameSymbolId.ANCHOR, GameSymbolId.ANCHOR];
        // startSymbolIds.push(GameSymbolId.BANANA);
        // startSymbolIds.push(GameSymbolId.BANANA, GameSymbolId.THIEF)
        // startSymbolIds.push(GameSymbolId.BEE, GameSymbolId.BEE, GameSymbolId.BEE, GameSymbolId.BEE, GameSymbolId.BEE, GameSymbolId.BEE, GameSymbolId.BEE, GameSymbolId.BEE, GameSymbolId.BEE, GameSymbolId.BEE, GameSymbolId.BEE, GameSymbolId.BEE, GameSymbolId.BEE, GameSymbolId.BEE, GameSymbolId.BEE, GameSymbolId.BEE);
        // startSymbolIds.push(GameSymbolId.POLICEMAN, GameSymbolId.THIEF);
        // startSymbolIds.push(GameSymbolId.BUBBLE);
        // startSymbolIds.push(GameSymbolId.MILK, GameSymbolId.CAT, GameSymbolId.CAT, GameSymbolId.CAT, GameSymbolId.CAT, GameSymbolId.CAT, GameSymbolId.CAT, GameSymbolId.CAT, GameSymbolId.CAT, GameSymbolId.CAT, GameSymbolId.CAT, GameSymbolId.CAT, GameSymbolId.CAT, GameSymbolId.CAT, GameSymbolId.CAT);
        // startSymbolIds.push(GameSymbolId.COAL);
        // startSymbolIds = [GameSymbolId.CRAB, GameSymbolId.CRAB, GameSymbolId.CRAB, GameSymbolId.CRAB];
        // startSymbolIds.push(GameSymbolId.CROW);
        // startSymbolIds.push(GameSymbolId.DOG, GameSymbolId.CULTIST, GameSymbolId.CULTIST, GameSymbolId.CULTIST, GameSymbolId.CULTIST, GameSymbolId.CULTIST, GameSymbolId.CULTIST, GameSymbolId.CULTIST, GameSymbolId.CULTIST, GameSymbolId.CULTIST, GameSymbolId.CULTIST);
        // startSymbolIds.push(GameSymbolId.DWARF, GameSymbolId.WINE, GameSymbolId.BEER, GameSymbolId.WINE, GameSymbolId.BEER, GameSymbolId.WINE, GameSymbolId.BEER, GameSymbolId.WINE, GameSymbolId.BEER, GameSymbolId.WINE, GameSymbolId.BEER);
        // startSymbolIds.push(GameSymbolId.EGG);
        // startSymbolIds.push(GameSymbolId.GAMBLER, GameSymbolId.THREE_SIDED_DIE, GameSymbolId.FIVE_SIDED_DIE);
        // startSymbolIds.push(GameSymbolId.GOLDFISH, GameSymbolId.BUBBLE, GameSymbolId.BUBBLE, GameSymbolId.BUBBLE, GameSymbolId.BUBBLE, GameSymbolId.BUBBLE);
        // startSymbolIds.push(GameSymbolId.GOOSE);
        // startSymbolIds.push(GameSymbolId.KEY, GameSymbolId.KEY, GameSymbolId.KEY, GameSymbolId.KEY, GameSymbolId.KEY, GameSymbolId.LOCKBOX, GameSymbolId.SAFE, GameSymbolId.TREASURE_CHEST, GameSymbolId.MEGA_CHEST);
        // startSymbolIds.push(GameSymbolId.LIGHT_BULB);
        // startSymbolIds.push(GameSymbolId.LIGHT_BULB, GameSymbolId.PEARL, GameSymbolId.PEARL, GameSymbolId.PEARL, GameSymbolId.PEARL, GameSymbolId.PEARL, GameSymbolId.PEARL, GameSymbolId.PEARL, GameSymbolId.PEARL, GameSymbolId.PEARL, GameSymbolId.PEARL, GameSymbolId.PEARL, GameSymbolId.PEARL, GameSymbolId.PEARL, GameSymbolId.PEARL);
        // startSymbolIds.push(GameSymbolId.AMETHYST, GameSymbolId.LIGHT_BULB, GameSymbolId.LIGHT_BULB, GameSymbolId.LIGHT_BULB, GameSymbolId.LIGHT_BULB, GameSymbolId.LIGHT_BULB, GameSymbolId.LIGHT_BULB, GameSymbolId.LIGHT_BULB, GameSymbolId.LIGHT_BULB, GameSymbolId.LIGHT_BULB, GameSymbolId.LIGHT_BULB);
        // startSymbolIds.push(GameSymbolId.VOID_STONE, GameSymbolId.PEARL, GameSymbolId.PEARL, GameSymbolId.PEARL, GameSymbolId.PEARL, GameSymbolId.PEARL, GameSymbolId.PEARL, GameSymbolId.PEARL, GameSymbolId.PEARL, GameSymbolId.PEARL, GameSymbolId.PEARL, GameSymbolId.PEARL, GameSymbolId.PEARL, GameSymbolId.PEARL, GameSymbolId.PEARL);
        // startSymbolIds.push(GameSymbolId.VOID_STONE, GameSymbolId.VOID_FRUIT, GameSymbolId.VOID_CREATURE, GameSymbolId.PEARL, GameSymbolId.PEARL, GameSymbolId.PEARL, GameSymbolId.PEARL, GameSymbolId.PEARL, GameSymbolId.PEARL, GameSymbolId.PEARL, GameSymbolId.PEARL, GameSymbolId.PEARL, GameSymbolId.PEARL, GameSymbolId.PEARL, GameSymbolId.PEARL);
        // startSymbolIds.push(GameSymbolId.REMOVAL_CAPSULE);
        // startSymbolIds.push(GameSymbolId.GEOLOGIST, GameSymbolId.MINER, GameSymbolId.GOLEM, GameSymbolId.GOLEM, GameSymbolId.GOLEM, GameSymbolId.GOLEM, GameSymbolId.GOLEM);
        // startSymbolIds.push(GameSymbolId.TODDLER, GameSymbolId.MILK);

        // // TEST - generate MANY symbols
        // const ignoreSymbolIds: string[] = [GameSymbolId.EMPTY];
        // const allSymbolIds: DeepReadonly<IGameSlotSymbolConfigVO>[] = [
        //     ...this.gameLogicTools.getSymbolsForRarity(RarityId.COMMON),
        //     ...this.gameLogicTools.getSymbolsForRarity(RarityId.UNCOMMON),
        //     ...this.gameLogicTools.getSymbolsForRarity(RarityId.RARE),
        //     ...this.gameLogicTools.getSymbolsForRarity(RarityId.EPIC)
        // ];
        // const testSymbolsCount: number = 30;
        // // const testSymbolsCount: number = 20;
        // // const testSymbolsCount: number = 10;
        // // const testSymbolsCount: number = 5;
        // while (startSymbolIds.length < testSymbolsCount) {
        //     let randSymbol: DeepReadonly<IGameSlotSymbolConfigVO> = ArrayTools.getRandomItem(allSymbolIds);
        //     if (ignoreSymbolIds.indexOf(randSymbol.id) === -1) {
        //         startSymbolIds.push(randSymbol.id);
        //     }
        // }

        // Add empty symbols (if needed)
        while (startSymbolIds.length < gameLogicState.gameLogic.static.reels.minSymbolsCount) {
            startSymbolIds.push(GameSymbolId.EMPTY);
        }

        for (let singleSymbolId of startSymbolIds) {
            this.gameSymbolTools.addAvailableSymbolId(singleSymbolId as GameSymbolId);
            this.gameSymbolTools.addOpenSymbolId(singleSymbolId as GameSymbolId);
        }

        const curFloor = this.gameLogicTools.getActiveFloor();
        const curMissionId: string = curFloor.missions[0]
        await getInstance(StartMissionCommand, curMissionId)
            .execute();

        await getInstance(PrepareReelSetForSpinCommand)
            .execute();

        await getInstance(InitReelsCommand)
            .execute();

        getInstance(ShowMissionPopupCommand, curMissionId)
            .execute();

        this.notifyComplete();
    }

}