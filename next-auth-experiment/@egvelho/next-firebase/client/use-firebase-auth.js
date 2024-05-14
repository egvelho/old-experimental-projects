"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFirebaseAuth = void 0;
var tslib_1 = require("tslib");
var app_1 = tslib_1.__importDefault(require("firebase/app"));
var react_1 = require("react");
var firebase_config_1 = tslib_1.__importDefault(require("./firebase-config"));
function requestCode(phoneNumber, countryPrefix) {
    if (countryPrefix === void 0) { countryPrefix = "+55"; }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var success, container, body, recaptchaVerifier, id, confirmationResult, _a, containerElement;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    success = false;
                    container = document.createElement("div");
                    body = document.querySelector("body");
                    container.id = ("recaptcha-container-" + Math.random() * 255).replace(".", "-");
                    container.style.display = "none";
                    body === null || body === void 0 ? void 0 : body.appendChild(container);
                    recaptchaVerifier = new app_1.default.auth.RecaptchaVerifier(container.id, {
                        size: "invisible",
                        callback: function () { return (success = true); },
                    });
                    return [4 /*yield*/, recaptchaVerifier.render()];
                case 1:
                    id = _b.sent();
                    // @ts-ignore
                    grecaptcha.execute(id);
                    _b.label = 2;
                case 2:
                    if (!!success) return [3 /*break*/, 4];
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 2];
                case 4:
                    _b.trys.push([4, 6, 7, 8]);
                    return [4 /*yield*/, app_1.default
                            .auth()
                            .signInWithPhoneNumber("" + countryPrefix + phoneNumber.replace(/\D+/g, ""), recaptchaVerifier)];
                case 5:
                    confirmationResult = _b.sent();
                    return [2 /*return*/, confirmationResult];
                case 6:
                    _a = _b.sent();
                    return [2 /*return*/, undefined];
                case 7:
                    containerElement = document.querySelector("#" + container.id);
                    containerElement && (body === null || body === void 0 ? void 0 : body.removeChild(containerElement));
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function verifyCode(_a) {
    var _b;
    var confirmationResult = _a.confirmationResult, code = _a.code;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var result, token, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, confirmationResult.confirm(code)];
                case 1:
                    result = _d.sent();
                    return [4 /*yield*/, ((_b = result.user) === null || _b === void 0 ? void 0 : _b.getIdToken())];
                case 2:
                    token = _d.sent();
                    return [2 /*return*/, token];
                case 3:
                    _c = _d.sent();
                    return [2 /*return*/, undefined];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function useFirebaseAuth() {
    react_1.useEffect(function () {
        firebase_config_1.default.languageCode &&
            (app_1.default.auth().languageCode = firebase_config_1.default.languageCode);
    }, []);
    var _a = tslib_1.__read(react_1.useState({
        loading: false,
        confirmationResult: undefined,
    }), 2), state = _a[0], setState = _a[1];
    return {
        loading: state.loading,
        requestCode: function (phoneNumber) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var confirmationResult;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setState(tslib_1.__assign(tslib_1.__assign({}, state), { loading: true }));
                            return [4 /*yield*/, requestCode(phoneNumber)];
                        case 1:
                            confirmationResult = _a.sent();
                            setState(tslib_1.__assign(tslib_1.__assign({}, state), { loading: false, confirmationResult: confirmationResult }));
                            return [2 /*return*/, !!confirmationResult];
                    }
                });
            });
        },
        verifyCode: function (code) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var token, _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            setState(tslib_1.__assign(tslib_1.__assign({}, state), { loading: true }));
                            _a = state.confirmationResult;
                            if (!_a) return [3 /*break*/, 2];
                            return [4 /*yield*/, verifyCode({
                                    code: code,
                                    confirmationResult: state.confirmationResult,
                                })];
                        case 1:
                            _a = (_b.sent());
                            _b.label = 2;
                        case 2:
                            token = _a;
                            setState(tslib_1.__assign(tslib_1.__assign({}, state), { loading: false }));
                            return [2 /*return*/, token];
                    }
                });
            });
        },
    };
}
exports.useFirebaseAuth = useFirebaseAuth;
//# sourceMappingURL=use-firebase-auth.js.map