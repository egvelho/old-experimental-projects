import { Elm } from "../elm/Main.elm";

function createElmNode() {
    let elmNode = document.createElement("div");
    elmNode.id = "main";
    document.body.appendChild(elmNode);
}

export default async function injectElm() {
    createElmNode();
    const app = Elm.Main.init({
        node: document.querySelector("#main"),
    });

    return app;
}
