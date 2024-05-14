importScripts("/firebase-app.js");
importScripts("/firebase-messaging.js");

firebase.initializeApp({
    messagingSenderId: "__FIREBASE_MESSAGING_SENDER_ID__",
});

const messaging = firebase.messaging();
