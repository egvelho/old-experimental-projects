"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithFirebaseNotifications = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var app_1 = tslib_1.__importDefault(require("firebase/app"));
var firebase_config_1 = tslib_1.__importDefault(require("./firebase-config"));
function startNotifications(_a) {
    var _b;
    var onMessage = _a.onMessage, onTokenRefresh = _a.onTokenRefresh, beforeRequestPermission = _a.beforeRequestPermission;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var messagingInstance, _c, permission, token;
        var _this = this;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!("Notification" in window) || !app_1.default.messaging.isSupported()) {
                        return [2 /*return*/];
                    }
                    messagingInstance = app_1.default.messaging();
                    messagingInstance.usePublicVapidKey((_b = firebase_config_1.default.publicVapidKey) !== null && _b !== void 0 ? _b : "");
                    _c = beforeRequestPermission;
                    if (!_c) return [3 /*break*/, 2];
                    return [4 /*yield*/, beforeRequestPermission()];
                case 1:
                    _c = (_d.sent());
                    _d.label = 2;
                case 2:
                    _c;
                    return [4 /*yield*/, Notification.requestPermission()];
                case 3:
                    permission = _d.sent();
                    if (!(permission === "granted")) return [3 /*break*/, 5];
                    return [4 /*yield*/, messagingInstance.getToken()];
                case 4:
                    token = _d.sent();
                    onTokenRefresh && onTokenRefresh(token);
                    _d.label = 5;
                case 5:
                    messagingInstance.onTokenRefresh(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var token;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, messagingInstance.getToken()];
                                case 1:
                                    token = _a.sent();
                                    onTokenRefresh && onTokenRefresh(token);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    onMessage && messagingInstance.onMessage(onMessage);
                    return [2 /*return*/];
            }
        });
    });
}
function WithFirebaseNotifications(props) {
    react_1.useEffect(function () {
        startNotifications(props);
    }, []);
    return null;
}
exports.WithFirebaseNotifications = WithFirebaseNotifications;
//# sourceMappingURL=with-firebase-notifications.js.map