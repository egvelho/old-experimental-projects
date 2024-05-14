"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaImage = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var head_1 = tslib_1.__importDefault(require("next/head"));
function MetaImage(_a) {
    var image = _a.image;
    return (react_1.default.createElement(head_1.default, null,
        react_1.default.createElement("meta", { key: "twitter-image", name: "twitter:image", content: image }),
        react_1.default.createElement("meta", { key: "og-image", property: "og:image", content: image })));
}
exports.MetaImage = MetaImage;
//# sourceMappingURL=image.js.map