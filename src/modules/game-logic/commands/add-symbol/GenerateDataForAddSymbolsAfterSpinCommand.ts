import { BaseAppCommand } from "@flashist/appframework/base/commands/BaseAppCommand";
import { appStorage } from "@flashist/appframework/state/AppStateModule";
import { DeepReadonly } from "@flashist/appframework/state/data/DeepReadableTypings";
import { ArrayTools } from "@flashist/fcore";
import { getInstance } from "@flashist/flibs";
import { GamePageModuleState } from "../../../game-page/data/state/GamePageModuleState";
import { GameSymbolId } from "../../../game-slot-reels/data/symbols/GameSymbolId";
import { IGameSlotSymbolConfigVO } from "../../../game-slot-reels/data/symbols/IGameSlotSymbolConfigVO";
import { RarityId } from "../../data/rarity/RarityId";
import { GameLogicModuleState } from "../../data/state/GameLogicModuleState";
import { GameLogicTools } from "../../tools/GameLogicTools";
import { WaitAppStorageDataChageCommand } from "../state/WaitAppStorageDataChangeCommand";
import {IMissionConfigVO} from "../../data/state/IMissionConfigVO";

export class GenerateDataForAddSymbolsAfterSpinCommand extends BaseAppCommand {
    protected gameLogicState = appStorage().getState<GameLogicModuleState>();
    protected gameLogicTools: GameLogicTools = getInstance(GameLogicTools);

    protected executeInternal(): void {

        const curMission: IMissionConfigVO = this.gameLogicTools.getActiveFloorActiveMission();

        let availableSymbolsPerRarityIdMap: Record<string, DeepReadonly<IGameSlotSymbolConfigVO[]>> = {};
        let symbolsToChooseFromList: DeepReadonly<IGameSlotSymbolConfigVO>[] = [];
        let symbolIds: string[] = [];

        let requiredRarities: string[] = [];
        let availableRarities: string[] = [];
        if (this.gameLogicState.gameLogic.dynamic.missionSpins === 0) {
            if (curMission.startBonus) {
                if (curMission.startBonus?.symbols.requiredRarities) {
                    requiredRarities.push(...curMission.startBonus?.symbols.requiredRarities);
                }

                if (curMission.startBonus?.symbols.availableRarities) {
                    availableRarities.push(...curMission.startBonus?.symbols.availableRarities);
                }
            }
        }

        if (this.gameLogicState.gameLogic.dynamic.nextSpinRequiredRarities) {
            requiredRarities.push(...this.gameLogicState.gameLogic.dynamic.nextSpinRequiredRarities);
        }

        if (availableRarities.length <= 0) {
            availableRarities = null;
        }

        if (requiredRarities.length <= 0) {
            requiredRarities = null;
        }

        const addSymbolsCount: number = this.gameLogicState.gameLogic.dynamic.addSymbolsCount;
        for (let symbolIndex: number = 0; symbolIndex < addSymbolsCount; symbolIndex++) {
            let randRarity: RarityId;
            if (requiredRarities && requiredRarities.length > 0) {
                randRarity = requiredRarities.pop() as RarityId;

            } else {
                randRarity = this.gameLogicTools.getRandomRarityForCurrentState(availableRarities)
            }

            let availableSymbols: Readonly<DeepReadonly<IGameSlotSymbolConfigVO>[]> = availableSymbolsPerRarityIdMap[randRarity];
            if (!availableSymbols) {
                availableSymbols = this.gameLogicTools.getSymbolsForRarity(randRarity);

                availableSymbolsPerRarityIdMap[randRarity] = availableSymbols;
            }

            const randSymbol: DeepReadonly<IGameSlotSymbolConfigVO> = ArrayTools.getRandomItem(availableSymbols, symbolsToChooseFromList);
            symbolsToChooseFromList.push(randSymbol);

            symbolIds.push(randSymbol.id);
        }

        // TEST
        // symbolIds.unshift(GameSymbolId.AMETHYST);
        // symbolIds.unshift(GameSymbolId.APPLE);
        // symbolIds.unshift(GameSymbolId.ANCHOR);
        // symbolIds.unshift(GameSymbolId.BANANA);
        // symbolIds.unshift(GameSymbolId.BANKNOTE);
        // symbolIds.unshift(GameSymbolId.BARTENDER);
        // symbolIds.unshift(GameSymbolId.BAR_OF_SOAP);
        // symbolIds.unshift(GameSymbolId.BEAR);
        // symbolIds.unshift(GameSymbolId.BEASTMASTER);
        // symbolIds.unshift(GameSymbolId.BEE);
        // symbolIds.unshift(GameSymbolId.BEEHIVE);
        // symbolIds.unshift(GameSymbolId.BEER);
        // symbolIds.unshift(GameSymbolId.BIG_ORE);
        // symbolIds.unshift(GameSymbolId.BIG_URN);
        // symbolIds.unshift(GameSymbolId.BILLIONAIRE);
        // symbolIds.unshift(GameSymbolId.BOW_WOODEN);
        // symbolIds.unshift(GameSymbolId.BOW_SILVER);
        // symbolIds.unshift(GameSymbolId.BOW_GOLDEN);
        // symbolIds.unshift(GameSymbolId.BUBBLE);
        // symbolIds.unshift(GameSymbolId.BUFFING_CAPSULE);
        // symbolIds.unshift(GameSymbolId.CANDY);
        // symbolIds.unshift(GameSymbolId.CARD_SHARK);
        // symbolIds.unshift(GameSymbolId.CAT);
        // symbolIds.unshift(GameSymbolId.CHEF);
        // symbolIds.unshift(GameSymbolId.CHEESE);
        // symbolIds.unshift(GameSymbolId.CHICK);
        // symbolIds.unshift(GameSymbolId.CLOWN);
        // symbolIds.unshift(GameSymbolId.CLUBS);
        // symbolIds.unshift(GameSymbolId.COAL);
        // symbolIds.unshift(GameSymbolId.COIN);
        // symbolIds.unshift(GameSymbolId.COCONUT);
        // symbolIds.unshift(GameSymbolId.COCONUT_HALF);
        // symbolIds.unshift(GameSymbolId.COW);
        // symbolIds.unshift(GameSymbolId.CRAB);
        // symbolIds.unshift(GameSymbolId.CROW);
        // symbolIds.unshift(GameSymbolId.CULTIST);
        // symbolIds.unshift(GameSymbolId.DAME);
        // symbolIds.unshift(GameSymbolId.DIAMONDS);
        // symbolIds.unshift(GameSymbolId.DIAMOND_GEM);
        // symbolIds.unshift(GameSymbolId.DIVER);
        // symbolIds.unshift(GameSymbolId.DOG);
        // symbolIds.unshift(GameSymbolId.EMERALD);
        // symbolIds.unshift(GameSymbolId.FARMER);
        // symbolIds.unshift(GameSymbolId.FIVE_SIDED_DIE);
        // symbolIds.unshift(GameSymbolId.FROZEN_FOSSIL);
        // symbolIds.unshift(GameSymbolId.GAMBLER);
        // symbolIds.unshift(GameSymbolId.GEOLOGIST);
        // symbolIds.unshift(GameSymbolId.GHOST);
        // symbolIds.unshift(GameSymbolId.GOLDEN_EGG);
        // symbolIds.unshift(GameSymbolId.GOLDFISH);
        // symbolIds.unshift(GameSymbolId.GOLEM);
        // symbolIds.unshift(GameSymbolId.HEARTS);
        // symbolIds.unshift(GameSymbolId.HEX_OF_DESTRUCTION);
        // symbolIds.unshift(GameSymbolId.HEX_OF_DRAINING);
        // symbolIds.unshift(GameSymbolId.HEX_OF_MIDAS);
        // symbolIds.unshift(GameSymbolId.HEX_OF_TEDIUM);
        // symbolIds.unshift(GameSymbolId.HEX_OF_THIEVERY);
        // symbolIds.unshift(GameSymbolId.HIGHLANDER);
        // symbolIds.unshift(GameSymbolId.HONEY);
        // symbolIds.unshift(GameSymbolId.HOOLIGAN);
        // symbolIds.unshift(GameSymbolId.JELLYFISH);
        // symbolIds.unshift(GameSymbolId.JOKER);
        // symbolIds.unshift(GameSymbolId.KEY);
        // symbolIds.unshift(GameSymbolId.KING_MIDAS);
        // symbolIds.unshift(GameSymbolId.LIGHT_BULB);
        // symbolIds.unshift(GameSymbolId.LOCKBOX);
        // symbolIds.unshift(GameSymbolId.LUCKY_CAPSULE);
        // symbolIds.unshift(GameSymbolId.MAGPIE);
        // symbolIds.unshift(GameSymbolId.MAGIC_KEY);
        // symbolIds.unshift(GameSymbolId.MEGA_CHEST);
        // symbolIds.unshift(GameSymbolId.MARTINI);
        // symbolIds.unshift(GameSymbolId.MATRYOSHKA_DOLL);
        // symbolIds.unshift(GameSymbolId.MIDAS_BOMB);
        // symbolIds.unshift(GameSymbolId.MILK);
        // symbolIds.unshift(GameSymbolId.MINE);
        // symbolIds.unshift(GameSymbolId.MINER);
        // symbolIds.unshift(GameSymbolId.MONKEY);
        // symbolIds.unshift(GameSymbolId.MOON);
        // symbolIds.unshift(GameSymbolId.MOUSE);
        // symbolIds.unshift(GameSymbolId.MRS_FRUIT);
        // symbolIds.unshift(GameSymbolId.NINJA);
        // symbolIds.unshift(GameSymbolId.OMELETTE);
        // symbolIds.unshift(GameSymbolId.ORANGE);
        // symbolIds.unshift(GameSymbolId.ORE);
        // symbolIds.unshift(GameSymbolId.OWL);
        // symbolIds.unshift(GameSymbolId.OYSTER);
        // symbolIds.unshift(GameSymbolId.PEACH);
        // symbolIds.unshift(GameSymbolId.PEAR);
        // symbolIds.unshift(GameSymbolId.PEARL);
        // symbolIds.unshift(GameSymbolId.PINATA);
        // symbolIds.unshift(GameSymbolId.PIRATE);
        // symbolIds.unshift(GameSymbolId.POLICEMAN);
        // symbolIds.unshift(GameSymbolId.PRESENT);
        // symbolIds.unshift(GameSymbolId.PUFFERFISH);
        // symbolIds.unshift(GameSymbolId.RABBIT);
        // symbolIds.unshift(GameSymbolId.RABBIT_FLUFF);
        // symbolIds.unshift(GameSymbolId.RAIN);
        // symbolIds.unshift(GameSymbolId.REMOVAL_CAPSULE);
        // symbolIds.unshift(GameSymbolId.REROLL_CAPSULE);
        // symbolIds.unshift(GameSymbolId.ROBIN_HOOD);
        // symbolIds.unshift(GameSymbolId.RUBY);
        // symbolIds.unshift(GameSymbolId.SAFE);
        // symbolIds.unshift(GameSymbolId.SAPPHIRE);
        // symbolIds.unshift(GameSymbolId.SEED);
        // symbolIds.unshift(GameSymbolId.SHINY_PEBBLE);
        // symbolIds.unshift(GameSymbolId.SLOTH);
        // symbolIds.unshift(GameSymbolId.SNAIL);
        // symbolIds.unshift(GameSymbolId.SPADES);
        // symbolIds.unshift(GameSymbolId.STRAWBERRY);
        // symbolIds.unshift(GameSymbolId.SUN);
        // symbolIds.unshift(GameSymbolId.SUPERVILLAIN);
        // symbolIds.unshift(GameSymbolId.TARGET);
        // symbolIds.unshift(GameSymbolId.TEDIUM_CAPSULE);
        // symbolIds.unshift(GameSymbolId.THIEF);
        // symbolIds.unshift(GameSymbolId.THREE_SIDED_DIE);
        // symbolIds.unshift(GameSymbolId.TREASURE_CHEST);
        // symbolIds.unshift(GameSymbolId.TURTLE);
        // symbolIds.unshift(GameSymbolId.TODDLER);
        // symbolIds.unshift(GameSymbolId.TOMB);
        // symbolIds.unshift(GameSymbolId.TREASURE_CHEST);
        // symbolIds.unshift(GameSymbolId.URN);
        // symbolIds.unshift(GameSymbolId.VOID_CREATURE);
        // symbolIds.unshift(GameSymbolId.VOID_FRUIT);
        // symbolIds.unshift(GameSymbolId.VOID_STONE);
        // symbolIds.unshift(GameSymbolId.WATERMELON);
        // symbolIds.unshift(GameSymbolId.WEALTHY_CAPSULE);
        // symbolIds.unshift(GameSymbolId.WINE);
        // symbolIds.unshift(GameSymbolId.WITCH);
        // symbolIds.unshift(GameSymbolId.WOLF);

        appStorage().change<GamePageModuleState>()("gamePage.popups.addSymbol.symbolIds", symbolIds);

        for (let singleSymbolId of symbolIds) {
            if (this.gameLogicState.gameLogic.dynamicNotResettable.openSymbolIds.indexOf(singleSymbolId) === -1) {
                appStorage().push<GameLogicModuleState>()(
                    "gameLogic.dynamicNotResettable.openSymbolIds",
                    singleSymbolId
                );
            }
        }

        this.notifyComplete();
    }

}