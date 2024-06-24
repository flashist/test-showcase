import { ReelState } from "./ReelState";

export interface ISingleReelVO {
    index: number;
    position: number;

    state: ReelState;

    // Speed is defined by the symbol height per second,
    // that means that if the speed is 1, then visually
    // reels would rotate 1 symbol height per 1 second
    speed: number;
    speedMovementActive: boolean;
}