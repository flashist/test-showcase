// // PWA: START
// if ("serviceWorker" in navigator) {
//     window.addEventListener("load", function() {
//         navigator.serviceWorker
//             .register(
//                 "./sw.js",
//                 {
//                     scope: "./"
//                 }
//             )
//             .then(res => console.log("service worker registered"))
//             .catch(err => console.log("service worker not registered", err))
//     })
// }
// // PWA: END

import * as PIXI from "pixi.js";
import { v4 as uuidv4 } from "uuid";

import { Facade } from "@flashist/appframework/facade/Facade";

import { TemplateFacade } from "./TemplateFacade";
import { FLabel } from "@flashist/flibs";

import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { Analytics as FirebaseAnalytics } from "@firebase/analytics";
import { Analytics } from "./modules/analytics/Analytics";
import { AnalyticsEvent } from "./modules/analytics/AnalyticsEvent";

if (!IS_DEV) {
    // FIREBASE: START
    const firebaseConfig = {
        apiKey: "AIzaSyAoNjZ4jSei7BadOp2koB_QOvuv6tik5yo",
        authDomain: "lucky-landlord-2236b.firebaseapp.com",
        projectId: "lucky-landlord-2236b",
        storageBucket: "lucky-landlord-2236b.appspot.com",
        messagingSenderId: "477110501185",
        appId: "1:477110501185:web:5d05a6a3c64a8d7b102bc0",
        measurementId: "G-PSP7V4P2E3"
    };
    const firebaseApp = initializeApp(firebaseConfig);
    const firebaseAnalytics: FirebaseAnalytics = getAnalytics(firebaseApp);
    Analytics.firebaseAnalytics = firebaseAnalytics;
    //
    Analytics.init({
        app_version: VERSION,
        user_id: uuidv4()
    })
    // FIREBASE: END
}

// PIXI
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;
PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH;
PIXI.settings.RENDER_OPTIONS.antialias = true;
PIXI.settings.RENDER_OPTIONS.autoDensity = true;
// PIXI.settings.RESOLUTION = 2;

Analytics.logEvent(AnalyticsEvent.GAME_OPEN);

FLabel.DEFAULT_CONFIG.lineJoin = "round";

Facade.init(
    {
        debug: IS_DEV,
        FacadeClass: TemplateFacade
    }
);