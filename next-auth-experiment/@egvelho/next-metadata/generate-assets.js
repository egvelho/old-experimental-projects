"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAssets = void 0;
var tslib_1 = require("tslib");
function generateAssets(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.appPath, appPath = _c === void 0 ? "app.json" : _c, _d = _b.outPath, outPath = _d === void 0 ? "public.json" : _d;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        function callback(error, response) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    if (error) {
                        console.error(error.message);
                        return [2 /*return*/];
                    }
                    tslib_1.__spread(response.images, response.files).forEach(function (_a) {
                        var name = _a.name, contents = _a.contents;
                        console.log("Writing to " + outPath + "/" + name + "...");
                        fs.writeFileSync(path.join(outPath, name), contents, "binary");
                    });
                    return [2 /*return*/];
                });
            });
        }
        var favicons, fs, path, app, configuration;
        var _this = this;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (typeof window !== "undefined") {
                        return [2 /*return*/];
                    }
                    console.log("Generating meta assets...");
                    favicons = eval('require("favicons")');
                    fs = eval('require("fs")');
                    path = eval('require("path")');
                    app = JSON.parse(fs.readFileSync(appPath));
                    configuration = {
                        path: "/",
                        appName: app.name,
                        appShortName: app.shortName,
                        appDescription: app.description,
                        developerName: app.developerName,
                        developerURL: app.developerURL,
                        dir: "auto",
                        lang: app.lang,
                        background: app.backgroundColor,
                        theme_color: app.dashColor,
                        appleStatusBarStyle: "default",
                        display: "standalone",
                        orientation: app.orientation,
                        scope: "/",
                        start_url: "/",
                        version: app.version,
                        logging: false,
                        pixel_art: false,
                        loadManifestWithCredentials: false,
                        icons: {
                            android: true,
                            appleIcon: true,
                            appleStartup: true,
                            coast: false,
                            favicons: true,
                            firefox: true,
                            windows: true,
                            yandex: false,
                        },
                    };
                    return [4 /*yield*/, new Promise(function (resolve) {
                            return favicons(app.iconPath, configuration, function () {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                    var _a;
                                    return tslib_1.__generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                _a = resolve;
                                                return [4 /*yield*/, callback.apply(void 0, tslib_1.__spread(args))];
                                            case 1:
                                                _a.apply(void 0, [_b.sent()]);
                                                return [2 /*return*/];
                                        }
                                    });
                                });
                            });
                        })];
                case 1:
                    _e.sent();
                    console.log("Assets generation success!");
                    return [2 /*return*/];
            }
        });
    });
}
exports.generateAssets = generateAssets;
//# sourceMappingURL=generate-assets.js.map