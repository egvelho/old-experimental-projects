"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.link = void 0;
function link(href, Icon, label, longLabel) {
    if (longLabel === void 0) { longLabel = label; }
    return { href: href, Icon: Icon, label: label, longLabel: longLabel };
}
exports.link = link;
//# sourceMappingURL=link.js.map