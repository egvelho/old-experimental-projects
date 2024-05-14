export default function toggleDrawer(callback) {
    const drawer = document.getElementsByTagName("mwc-drawer")[0];
    drawer.addEventListener("MDCDrawer:closed", () => callback(false));
}
