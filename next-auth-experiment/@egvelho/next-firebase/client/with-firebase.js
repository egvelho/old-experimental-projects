"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithFirebase = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var app_1 = tslib_1.__importDefault(require("firebase/app"));
var firebase_config_1 = tslib_1.__importDefault(require("./firebase-config"));
Promise.resolve().then(function () { return tslib_1.__importStar(require("firebase/messaging")); });
Promise.resolve().then(function () { return tslib_1.__importStar(require("firebase/analytics")); });
Promise.resolve().then(function () { return tslib_1.__importStar(require("firebase/auth")); });
function initializeApp(_a) {
    var analytics = _a.analytics, onUserLoaded = _a.onUserLoaded;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _this = this;
        return tslib_1.__generator(this, function (_b) {
            if (app_1.default.apps.length) {
                return [2 /*return*/];
            }
            app_1.default.initializeApp(firebase_config_1.default);
            analytics && app_1.default.analytics.isSupported() && app_1.default.analytics();
            onUserLoaded &&
                app_1.default.auth().onIdTokenChanged(function (user) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    return tslib_1.__generator(this, function (_a) {
                        if (user) {
                            onUserLoaded(user);
                        }
                        else {
                            onUserLoaded(undefined);
                        }
                        return [2 /*return*/];
                    });
                }); });
            return [2 /*return*/];
        });
    });
}
function WithFirebase(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.analytics, analytics = _c === void 0 ? false : _c, _d = _b.onUserLoaded, onUserLoaded = _d === void 0 ? function (user) { } : _d;
    react_1.useEffect(function () {
        initializeApp({ analytics: analytics, onUserLoaded: onUserLoaded });
    }, []);
    return null;
}
exports.WithFirebase = WithFirebase;
//# sourceMappingURL=with-firebase.js.map