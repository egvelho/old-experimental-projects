"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meta = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var author_1 = require("./author");
var description_1 = require("./description");
var image_1 = require("./image");
var keywords_1 = require("./keywords");
var misc_1 = require("./misc");
var page_url_1 = require("./page-url");
var title_1 = require("./title");
function Meta(props) {
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(author_1.MetaAuthor, { author: props.developerName }),
        react_1.default.createElement(description_1.MetaDescription, { description: props.description }),
        react_1.default.createElement(image_1.MetaImage, { image: props.image }),
        react_1.default.createElement(keywords_1.MetaKeywords, { keywords: props.keywords }),
        react_1.default.createElement(page_url_1.MetaPageUrl, { url: props.url }),
        react_1.default.createElement(title_1.MetaTitle, { title: props.name }),
        react_1.default.createElement(misc_1.MetaMisc, { facebookAppId: props.facebookAppId, twitterAt: props.twitterAt, name: props.name, dashColor: props.dashColor, url: props.url })));
}
exports.Meta = Meta;
//# sourceMappingURL=index.js.map