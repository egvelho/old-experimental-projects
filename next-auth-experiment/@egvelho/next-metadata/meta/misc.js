"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaMisc = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var head_1 = tslib_1.__importDefault(require("next/head"));
function MetaMisc(_a) {
    var facebookAppId = _a.facebookAppId, twitterAt = _a.twitterAt, url = _a.url, name = _a.name, dashColor = _a.dashColor;
    return (react_1.default.createElement(head_1.default, null,
        facebookAppId && (react_1.default.createElement("meta", { key: "fb-app-id", property: "fb:app_id", content: facebookAppId })),
        twitterAt && (react_1.default.createElement("meta", { key: "twitter-creator", name: "twitter-creator", content: twitterAt })),
        twitterAt && (react_1.default.createElement("meta", { key: "twitter-site", name: "twitter:site", content: twitterAt })),
        react_1.default.createElement("meta", { key: "url", name: "url", content: url }),
        react_1.default.createElement("meta", { key: "og-site-name", property: "og:site_name", content: name }),
        react_1.default.createElement("meta", { key: "application-name", name: "application-name", content: name }),
        react_1.default.createElement("meta", { key: "msapplication-tile-color", name: "msapplication-TileColor", content: dashColor }),
        react_1.default.createElement("meta", { key: "theme-color", name: "theme-color", content: dashColor })));
}
exports.MetaMisc = MetaMisc;
//# sourceMappingURL=misc.js.map