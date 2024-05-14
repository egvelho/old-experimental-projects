"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPages = void 0;
var tslib_1 = require("tslib");
function mapLinkToPage(link) {
    return {
        getStaticProps: function (getStaticProps) {
            var _this = this;
            return function (context) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = {};
                            return [4 /*yield*/, getStaticProps(context.params, context)];
                        case 1: return [2 /*return*/, (_a.props = _b.sent(),
                                _a)];
                    }
                });
            }); };
        },
        getStaticPaths: function (getStaticPaths) {
            var _this = this;
            return function (context) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = {};
                            return [4 /*yield*/, getStaticPaths(context)];
                        case 1: return [2 /*return*/, (_a.paths = (_b.sent()).map(function (params) { return ({
                                params: params,
                            }); }),
                                _a.fallback = false,
                                _a)];
                    }
                });
            }); };
        },
        getServerSideProps: function (getServerSideProps) {
            var _this = this;
            return function (context) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = {};
                            return [4 /*yield*/, getServerSideProps(context.params, context)];
                        case 1: return [2 /*return*/, (_a.props = _b.sent(),
                                _a)];
                    }
                });
            }); };
        },
        getServerSidePaths: function (getServerSidePaths) {
            var _this = this;
            return function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getServerSidePaths()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            }); }); };
        },
        page: function (page) {
            return page;
        },
        disallow: function (disallow) {
            return disallow;
        },
        priority: function (priority) {
            return priority;
        },
        changeFrequency: function (changeFrequency) {
            return changeFrequency;
        },
        getLastModificationDate: function (getLastModificationDate) {
            return function (query) { return getLastModificationDate(query); };
        },
    };
}
function getPages(links) {
    return Object.keys(links).reduce(function (pages, link) {
        var _a;
        return (tslib_1.__assign(tslib_1.__assign({}, pages), (_a = {}, _a[link] = mapLinkToPage(links[link]), _a)));
    }, {});
}
exports.getPages = getPages;
//# sourceMappingURL=get-pages.js.map