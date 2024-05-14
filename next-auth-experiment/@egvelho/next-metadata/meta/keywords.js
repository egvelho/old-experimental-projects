"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaKeywords = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var head_1 = tslib_1.__importDefault(require("next/head"));
function MetaKeywords(_a) {
    var keywords = _a.keywords;
    return (react_1.default.createElement(head_1.default, null,
        react_1.default.createElement("meta", { key: "keywords", name: "keywords", content: keywords.join(",") })));
}
exports.MetaKeywords = MetaKeywords;
//# sourceMappingURL=keywords.js.map