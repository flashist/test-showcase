import { Analytics as FirebaseAnalytics } from "firebase/analytics";
import { logEvent } from "firebase/analytics";
import { AnalyticsEvent } from "./AnalyticsEvent";
import { setUserProperties } from "@firebase/analytics";

// export declare const gtag: (type: "event", eventName: string, eventParams?: object) => void;

export class Analytics {

    static firebaseAnalytics: FirebaseAnalytics;

    private static isInitialized: boolean;

    static init(userProps: Record<string, any>): void {
        if (Analytics.isInitialized) {
            return;
        }
        Analytics.isInitialized = true;

        setUserProperties(Analytics.firebaseAnalytics, userProps);
    }


    static logEvent(eventName: string, data?: any): void {
        if (!Analytics.isInitialized) {
            return;
        }

        logEvent(Analytics.firebaseAnalytics, eventName, data);
    }
}