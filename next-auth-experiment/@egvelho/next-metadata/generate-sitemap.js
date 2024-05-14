"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSitemap = void 0;
var tslib_1 = require("tslib");
function getFiles(dir) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var fs, path, dirents, files;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fs = eval("require(\"fs\")");
                    path = eval("require(\"path\")");
                    dirents = fs.readdirSync(dir, { withFileTypes: true });
                    return [4 /*yield*/, Promise.all(dirents.map(function (dirent) {
                            var res = path.resolve(dir, dirent.name);
                            return dirent.isDirectory() ? getFiles(res) : res;
                        }))];
                case 1:
                    files = _b.sent();
                    return [2 /*return*/, (_a = Array.prototype).concat.apply(_a, tslib_1.__spread(files))];
            }
        });
    });
}
function getUrls(files, mapPathToImport) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var path;
        var _this = this;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    path = eval("require(\"path\")");
                    return [4 /*yield*/, Promise.all(files
                            .map(function (file) { return "." + path.sep + path.relative(process.cwd(), file); })
                            .filter(function (file) { return !path.basename(file).startsWith("_"); })
                            .filter(function (file) {
                            return path.relative(path.join("pages", "api"), path.dirname(file));
                        })
                            .map(function (file) { return file.split(".").slice(0, -1).join("."); })
                            .map(function (file) { return file.replace(/\\/g, "/"); })
                            .map(function (file) { return file.replace("./pages/", ""); })
                            .map(function (file) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var page, getPaths, urls, _a, _b, _c, _d, _e;
                            var _f;
                            var _this = this;
                            var _g, _h, _j, _k, _l, _m;
                            return tslib_1.__generator(this, function (_o) {
                                switch (_o.label) {
                                    case 0: return [4 /*yield*/, mapPathToImport(file)];
                                    case 1:
                                        page = _o.sent();
                                        getPaths = (_g = page.getStaticPaths) !== null && _g !== void 0 ? _g : page.getServerSidePaths;
                                        if (getPaths && page.disallow) {
                                            return [2 /*return*/, []];
                                        }
                                        if (!getPaths) return [3 /*break*/, 4];
                                        _c = (_b = Promise).all;
                                        return [4 /*yield*/, getPaths({})];
                                    case 2: return [4 /*yield*/, _c.apply(_b, [(_h = (_o.sent()).paths) === null || _h === void 0 ? void 0 : _h.map(function (_a) {
                                                var params = _a.params;
                                                return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                                    var _b;
                                                    var _c;
                                                    var _d, _e, _f, _g;
                                                    return tslib_1.__generator(this, function (_h) {
                                                        switch (_h.label) {
                                                            case 0:
                                                                _c = {
                                                                    disallow: (_d = page.disallow) !== null && _d !== void 0 ? _d : false,
                                                                    priority: (_e = page.priority) !== null && _e !== void 0 ? _e : 0.5,
                                                                    changefreq: (_f = page.changeFrequency) !== null && _f !== void 0 ? _f : "daily"
                                                                };
                                                                _b = page.getLastModificationDate;
                                                                if (!_b) return [3 /*break*/, 2];
                                                                return [4 /*yield*/, page.getLastModificationDate(params)];
                                                            case 1:
                                                                _b = (_h.sent()).toISOString();
                                                                _h.label = 2;
                                                            case 2: return [2 /*return*/, (_c.lastmod = (_g = (_b)) !== null && _g !== void 0 ? _g : new Date().toISOString(),
                                                                    _c.url = "/" + objectToUrl(file, params) + "/",
                                                                    _c)];
                                                        }
                                                    });
                                                });
                                            })])];
                                    case 3:
                                        _a = _o.sent();
                                        return [3 /*break*/, 5];
                                    case 4:
                                        _a = [];
                                        _o.label = 5;
                                    case 5:
                                        urls = _a;
                                        if (!((urls || []).length > 0)) return [3 /*break*/, 6];
                                        _d = urls.reduce(function (stack, item) {
                                            var url = item.url;
                                            var urls = stack.map(function (_a) {
                                                var url = _a.url;
                                                return url;
                                            });
                                            if (urls.includes(url)) {
                                                return stack;
                                            }
                                            else {
                                                return tslib_1.__spread(stack, [item]);
                                            }
                                        }, []);
                                        return [3 /*break*/, 9];
                                    case 6:
                                        _f = {
                                            disallow: (_j = page.disallow) !== null && _j !== void 0 ? _j : false,
                                            priority: (_k = page.priority) !== null && _k !== void 0 ? _k : 0.5,
                                            changefreq: (_l = page.changeFrequency) !== null && _l !== void 0 ? _l : "daily"
                                        };
                                        _e = page.getLastModificationDate;
                                        if (!_e) return [3 /*break*/, 8];
                                        return [4 /*yield*/, page.getLastModificationDate()];
                                    case 7:
                                        _e = (_o.sent()).toISOString();
                                        _o.label = 8;
                                    case 8:
                                        _d = [
                                            (_f.lastmod = (_m = (_e)) !== null && _m !== void 0 ? _m : new Date().toISOString(),
                                                _f.url = file === "index" ? "/" : "/" + file + "/",
                                                _f)
                                        ];
                                        _o.label = 9;
                                    case 9: return [2 /*return*/, _d];
                                }
                            });
                        }); }))];
                case 1: return [2 /*return*/, (_a.sent()).flat()];
            }
        });
    });
}
function objectToUrl(url, object) {
    return url
        .split("/")
        .map(function (substring) { return substring.match(/\[([^\)]+)\]/); })
        .filter(function (substring) { return substring; })
        .reduce(function (newUrl, substring) {
        var _a;
        var urlKey = (substring !== null && substring !== void 0 ? substring : [])[0];
        var key = ((_a = (substring !== null && substring !== void 0 ? substring : [])[1]) !== null && _a !== void 0 ? _a : "").replace("...", "");
        var partialUrl = (function () {
            if (typeof object[key] === "string") {
                return newUrl.replace(urlKey, object[key]);
            }
            else if (urlKey.startsWith("[...")) {
                return newUrl.replace(urlKey, object[key].join("/"));
            }
            else {
                return newUrl.replace(urlKey, "");
            }
        })();
        return partialUrl;
    }, url);
}
function getSitemap(urls) {
    var _a = eval("require(\"sitemap\")"), SitemapStream = _a.SitemapStream, streamToPromise = _a.streamToPromise;
    var Readable = eval("require(\"stream\")").Readable;
    var links = urls
        .filter(function (_a) {
        var disallow = _a.disallow;
        return !disallow;
    })
        .map(function (_a) {
        var priority = _a.priority, changefreq = _a.changefreq, lastmod = _a.lastmod, url = _a.url;
        return ({
            url: url,
            changefreq: changefreq,
            priority: priority,
            lastmod: lastmod,
        });
    });
    if (links.length === 0) {
        return "";
    }
    var stream = new SitemapStream({ hostname: process.env.NEXT_PUBLIC_URL });
    return streamToPromise(Readable.from(links).pipe(stream)).then(function (data) {
        return data.toString();
    });
}
function getRobots(urls) {
    var _a, _b;
    var disallowedUrls = urls.filter(function (_a) {
        var url = _a.url, disallow = _a.disallow;
        return disallow;
    });
    var publicUrl = ((_a = process.env.NEXT_PUBLIC_URL) === null || _a === void 0 ? void 0 : _a.endsWith("/")) ? (_b = process.env.NEXT_PUBLIC_URL) === null || _b === void 0 ? void 0 : _b.slice(-1) : process.env.NEXT_PUBLIC_URL;
    return "User-agent: *\n" + disallowedUrls.map(function (_a) {
        var url = _a.url;
        return "Disallow: " + publicUrl + url + "\n";
    }) + "Sitemap: " + publicUrl + "/sitemap.xml";
}
function generateSitemap(_a) {
    var _b = _a.outPath, outPath = _b === void 0 ? "public" : _b, mapPathToImport = _a.mapPathToImport;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var fs, path, files, urls, sitemap, robots;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (typeof window !== "undefined") {
                        return [2 /*return*/];
                    }
                    console.log("Generating sitemap...");
                    fs = eval("require(\"fs\")");
                    path = eval("require(\"path\")");
                    return [4 /*yield*/, getFiles("./pages")];
                case 1:
                    files = (_c.sent());
                    return [4 /*yield*/, getUrls(files, mapPathToImport)];
                case 2:
                    urls = _c.sent();
                    return [4 /*yield*/, getSitemap(urls)];
                case 3:
                    sitemap = _c.sent();
                    robots = getRobots(urls);
                    console.log("Writing to " + outPath + "/sitemap.xml");
                    fs.writeFileSync(path.join(outPath, "sitemap.xml"), sitemap);
                    console.log("Writing to " + outPath + "/robots.txt");
                    fs.writeFileSync(path.join(outPath, "robots.txt"), robots);
                    console.log("Sitemap generation success!");
                    return [2 /*return*/];
            }
        });
    });
}
exports.generateSitemap = generateSitemap;
//# sourceMappingURL=generate-sitemap.js.map