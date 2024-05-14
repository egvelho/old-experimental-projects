"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaDescription = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var head_1 = tslib_1.__importDefault(require("next/head"));
function MetaDescription(_a) {
    var description = _a.description;
    return (react_1.default.createElement(head_1.default, null,
        react_1.default.createElement("meta", { key: "og-description", property: "og:description", content: description }),
        react_1.default.createElement("meta", { key: "twitter-description", name: "twitter:description", content: description }),
        react_1.default.createElement("meta", { key: "twitter-image-alt", name: "twitter:image:alt", content: description }),
        react_1.default.createElement("meta", { key: "description", name: "description", content: description })));
}
exports.MetaDescription = MetaDescription;
//# sourceMappingURL=description.js.map