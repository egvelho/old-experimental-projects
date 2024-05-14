require("dotenv").config();

const fs = require("fs");
const https = require("https");

const package = require("../package.json");

function loadFirebase() {
    const {
        FIREBASE_API_KEY,
        FIREBASE_AUTH_DOMAIN,
        FIREBASE_DATABASE_URL,
        FIREBASE_PROJECT_ID,
        FIREBASE_STORAGE_BUCKET,
        FIREBASE_MESSAGING_SENDER_ID,
        FIREBASE_APP_ID,
        FIREBASE_MEASUREMENT_ID,
        FIREBASE_PUBLIC_VAPID_KEY,
    } = process.env;

    const firebaseConfig = {
        apiKey: FIREBASE_API_KEY,
        authDomain: FIREBASE_AUTH_DOMAIN,
        databaseURL: FIREBASE_DATABASE_URL,
        projectId: FIREBASE_PROJECT_ID,
        storageBucket: FIREBASE_STORAGE_BUCKET,
        messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
        appId: FIREBASE_APP_ID,
        measurementId: FIREBASE_MEASUREMENT_ID,
        publicVapidKey: FIREBASE_PUBLIC_VAPID_KEY,
    };

    if (Object.values(firebaseConfig).every((entry) => entry)) {
        console.log("Firebase data found in env");

        const firebaseMessagingSw = `importScripts("/firebase-app.js");importScripts("/firebase-messaging.js");firebase.initializeApp(${JSON.stringify(
            firebaseConfig,
        )});const messaging = firebase.messaging();`;

        const firebaseVersion = package.dependencies.firebase
            .replace("^", "")
            .replace("~", "");

        const firebaseMessagingFile = fs.createWriteStream(
            "public/firebase-messaging.js",
        );
        const firebaseAppFile = fs.createWriteStream("public/firebase-app.js");

        console.log(`Using firebase version ${firebaseVersion}`);
        console.log("Loading firebase-messaging.js...");

        https.get(
            `https://www.gstatic.com/firebasejs/${firebaseVersion}/firebase-messaging.js`,
            (response) => {
                response.pipe(firebaseMessagingFile);
            },
        );

        console.log("Loading firebase-app.js...");

        https.get(
            `https://www.gstatic.com/firebasejs/${firebaseVersion}/firebase-app.js`,
            (response) => {
                response.pipe(firebaseAppFile);
            },
        );

        console.log("Loading firebase-messaging-sw.js...");

        fs.writeFileSync(
            "public/firebase-messaging-sw.js",
            firebaseMessagingSw,
        );
    } else {
        console.error("ERROR: Firebase data not found in env.");
    }
}

loadFirebase();
