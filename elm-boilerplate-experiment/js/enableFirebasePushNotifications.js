export default async function enableFirebasePushNotifications(
    firebase,
    onMessage_,
    onTokenRefresh_,
) {
    if ("serviceWorker" in navigator) {
        try {
            const messaging = firebase.messaging();

            if (!firebase.messaging.isSupported()) {
                return;
            }

            const token = await requestPermission(messaging);

            if (!token) {
                return;
            }

            onTokenRefresh(messaging, onTokenRefresh_, token);

            messaging.usePublicVapidKey(process.env.FIREBASE_PUBLIC_VAPID_KEY);
            messaging.onMessage(payload => onMessage(payload, onMessage_));
            messaging.onTokenRefresh(() =>
                onTokenRefresh(messaging, onTokenRefresh_),
            );
        } catch (error) {
            console.warn("enableFirebasePushNotifications", error);
        }
    }
}

async function requestPermission(messaging) {
    if (!Notification) {
        return undefined;
    }

    try {
        await messaging.requestPermission();
        const token = await messaging.getToken();
        return token;
    } catch (error) {
        console.warn("requestPermission", error);
        return undefined;
    }
}

async function onMessage(payload, callback) {
    console.log("onMessage", payload);
    callback(payload);
}

async function onTokenRefresh(messaging, callback, token) {
    if (token) {
        console.log("token", token);
        callback(token);
        return;
    }

    try {
        console.log("refreshedToken", refreshedToken);
        const refreshedToken = await messaging.getToken();
        callback(refreshedToken);
    } catch (error) {
        console.warn("onTokenRefresh", error);
    }
}
