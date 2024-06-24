import { ISlotSymbolStateConfigVO } from "./ISlotSymbolStateConfigVO";

export interface ISlotSymbolConfigVO {
    id?: string;
    zIndex?: number;

    states: {
        [stateId: string]: ISlotSymbolStateConfigVO
        // TODO: in the future we might change the configs, to make sure we can use not only images,
        // but also other type of assets (e.g. spine animations, conatiners and maybe timline-containers).
        // To achieve that the type of elements should be not just the id, but the id + type (e.g. {id: string, type: string}
    }
}