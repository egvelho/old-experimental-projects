import "../svg/elm-boilerplate-base.svg";
import "../svg/elm-boilerplate-mono.svg";
import "../svg/elm-boilerplate-circle.svg";
import "../svg/elm-boilerplate-square.svg";

function createSvgIconsNode() {
    let svgIconsNode = document.createElement("div");
    svgIconsNode.id = "svg-icons";
    document.body.appendChild(svgIconsNode);
}

export default async function injectSvgSprite() {
    createSvgIconsNode();

    const svgSpritePath = "__SPRITE_PATH__";
    const xhr = new XMLHttpRequest();
    const svgIconsNode = document.getElementById("svg-icons");

    xhr.onload = () =>
        xhr.status === 200 && (svgIconsNode.innerHTML = xhr.response);

    xhr.open("get", svgSpritePath, true);
    xhr.send();
}
