import loadFirebase from "./loadFirebase";
import toggleDrawer from "./toggleDrawer";

export default async function onElmLoad(app) {
    loadFirebase({
        onMessage: message => console.log("onMessage", message),
        onTokenRefresh: token => console.log("onTokenRefresh", token),
    });

    toggleDrawer(open => app.ports.toggleDrawer.send(open));
}
