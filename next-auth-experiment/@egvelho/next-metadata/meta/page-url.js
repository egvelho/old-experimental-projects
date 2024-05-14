"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaPageUrl = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var head_1 = tslib_1.__importDefault(require("next/head"));
function MetaPageUrl(_a) {
    var url = _a.url;
    return (react_1.default.createElement(head_1.default, null,
        react_1.default.createElement("meta", { key: "og-url", property: "og:url", content: url }),
        react_1.default.createElement("link", { key: "canonical", rel: "canonical", href: url })));
}
exports.MetaPageUrl = MetaPageUrl;
//# sourceMappingURL=page-url.js.map