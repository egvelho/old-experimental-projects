"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resizeImageAssets = void 0;
var tslib_1 = require("tslib");
var fs, join, sharp;
function resizeImagesFromPath(inputPath, size) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var paths;
        var _this = this;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    paths = fs.readdirSync(inputPath, { withFileTypes: true });
                    return [4 /*yield*/, Promise.all(paths.map(function (path) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var fullPath, buffer;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        fullPath = join(inputPath, path.name);
                                        if (!path.isDirectory()) return [3 /*break*/, 2];
                                        console.log("Entering in " + fullPath + "...");
                                        return [4 /*yield*/, resizeImagesFromPath(fullPath, size)];
                                    case 1:
                                        _a.sent();
                                        return [3 /*break*/, 4];
                                    case 2:
                                        if (![".jpg", ".jpeg", ".png"].some(function (extension) {
                                            return path.name.endsWith(extension);
                                        })) return [3 /*break*/, 4];
                                        return [4 /*yield*/, sharp(fullPath)
                                                .resize(size, size, {
                                                fit: "inside",
                                                withoutEnlargement: true,
                                            })
                                                .toBuffer()];
                                    case 3:
                                        buffer = _a.sent();
                                        fs.writeFileSync(fullPath, buffer);
                                        console.log("Resizing " + fullPath + " to fit " + size + "x" + size);
                                        _a.label = 4;
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function resizeImageAssets(_a) {
    var _b = _a.paths, paths = _b === void 0 ? ["public/images", ".next/static/images"] : _b, _c = _a.size, size = _c === void 0 ? 960 : _c;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    console.log("Starting image resize process...");
                    fs = eval('require("fs")');
                    join = eval('require("path")').join;
                    sharp = eval('require("sharp")');
                    sharp.cache(false);
                    sharp.simd(false);
                    return [4 /*yield*/, Promise.all(paths.map(function (path) { return resizeImagesFromPath(path, size); }))];
                case 1:
                    _d.sent();
                    console.log("Resizing success!");
                    return [2 /*return*/];
            }
        });
    });
}
exports.resizeImageAssets = resizeImageAssets;
//# sourceMappingURL=resize-image-assets.js.map