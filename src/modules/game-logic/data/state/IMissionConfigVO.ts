export interface IMissionConfigVO {
    id: string,
    
    texts: {
        title?: string;
        day?: string;
        goal?: string;
        message?: string;
    },

    rarity?: Record<string, number>;

    day?: number;
    coins?: number;
    spins?: number;

    startBonus?: {
        rerolls?: number;
        removes?: number;
        symbols: {
            availableRarities?: string[],
            requiredRarities?: string[]
        }
    }
}