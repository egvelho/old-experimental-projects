import "@webcomponents/webcomponentsjs/webcomponents-loader";
import "./injectEnv";
import "../css/reset.css";
import "./importMWC";
import injectSvgSprite from "./injectSvgSprite";
import injectElm from "./injectElm";
import onElmLoad from "./onElmLoad";

window.onload = () => {
    injectElm().then(onElmLoad);
    injectSvgSprite();
};
