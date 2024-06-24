import gsap from "gsap";

export class SlotTimeoutTools {

    protected static maxNumber: number = (Number.MAX_SAFE_INTEGER || Math.pow(2, 32) - 1);
    private static readonly delayedCalls: { [key: number]: gsap.core.Tween } = {};
    protected static lastTimeoutId: number = 0;

    protected static getId() {
        // Bullet-proof solution of the cases when MAX_SAFE_INTEGER is not available
        if (SlotTimeoutTools.lastTimeoutId >= SlotTimeoutTools.maxNumber) {
            SlotTimeoutTools.lastTimeoutId = 0;
        }
        return SlotTimeoutTools.lastTimeoutId++;
    }

    public static clearById(id: number) {
        const tempDelayedCall = SlotTimeoutTools.delayedCalls[id];
        if (tempDelayedCall) {
            tempDelayedCall.kill();
            delete SlotTimeoutTools.delayedCalls[id];
        }
    }

    static setInterval(handler: Function, timeout: number, scope?: any, ...args: any[]): number {
        const tempId = SlotTimeoutTools.getId();

        const timerForInterval = gsap.delayedCall(
            timeout / 1000,
            () => {
                timerForInterval.restart(true, true);
                handler.apply(scope, args);
            }
        );
        SlotTimeoutTools.delayedCalls[tempId] = timerForInterval;
        return tempId;
    }

    static clearInterval(id: number): void {
        SlotTimeoutTools.clearById(id);
    }

    static setTimeout(handler: Function, timeout: number, scope?: any, ...args: any[]): number {
        const id = SlotTimeoutTools.getId();
        SlotTimeoutTools.delayedCalls[id] = gsap.delayedCall(
            timeout / 1000,
            () => {
                handler.apply(scope, args);
            }
        );

        return id;
    }

    static clearTimeout(id: number): void {
        SlotTimeoutTools.clearById(id);
    }
}