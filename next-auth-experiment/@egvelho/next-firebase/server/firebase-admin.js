"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseNotification = exports.FirebaseToken = void 0;
var tslib_1 = require("tslib");
var firebase_admin_1 = require("firebase-admin");
var firebaseAdminApp;
function getFirebaseAdminApp() {
    var _a, _b, _c, _d;
    var firebaseConfig = {
        type: process.env.FIREBASE_TYPE,
        projectId: (_b = (_a = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) !== null && _a !== void 0 ? _a : process.env.REACT_APP_FIREBASE_PROJECT_ID) !== null && _b !== void 0 ? _b : process.env.FIREBASE_PROJECT_ID,
        privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        clientId: process.env.FIREBASE_CLIENT_ID,
        authUri: process.env.FIREBASE_AUTH_URI,
        tokenUri: process.env.FIREBASE_TOKEN_URI,
        authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        clientX509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL,
        databaseURL: (_d = (_c = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL) !== null && _c !== void 0 ? _c : process.env.REACT_APP_FIREBASE_DATABASE_URL) !== null && _d !== void 0 ? _d : process.env.FIREBASE_DATABASE_URL,
    };
    return firebase_admin_1.initializeApp({
        credential: firebase_admin_1.credential.cert(firebaseConfig),
        databaseURL: firebaseConfig.databaseURL,
    });
}
if (process.env.NODE_ENV === "production") {
    firebaseAdminApp = getFirebaseAdminApp();
}
else {
    if (!global.firebaseAdminApp) {
        global.firebaseAdminApp = getFirebaseAdminApp();
    }
    firebaseAdminApp = global.firebaseAdminApp;
}
function isValid(token) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var decodedToken, _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!token) {
                        return [2 /*return*/, false];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, firebaseAdminApp.auth().verifyIdToken(token)];
                case 2:
                    decodedToken = _b.sent();
                    return [2 /*return*/, true];
                case 3:
                    _a = _b.sent();
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function decode(token) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var decodedToken, _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!token) {
                        return [2 /*return*/, undefined];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, firebaseAdminApp.auth().verifyIdToken(token)];
                case 2:
                    decodedToken = _b.sent();
                    return [2 /*return*/, decodedToken];
                case 3:
                    _a = _b.sent();
                    return [2 /*return*/, undefined];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function send(token, _a) {
    var title = _a.title, body = _a.body, imageUrl = _a.imageUrl, data = _a.data;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, firebaseAdminApp.messaging().send({
                        token: token,
                        notification: {
                            title: title,
                            body: body,
                            imageUrl: imageUrl,
                        },
                        data: data,
                    })];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function sendToMany(tokens, _a) {
    var title = _a.title, body = _a.body, imageUrl = _a.imageUrl, data = _a.data;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, firebaseAdminApp.messaging().sendMulticast({
                        tokens: tokens,
                        notification: {
                            title: title,
                            body: body,
                            imageUrl: imageUrl,
                        },
                        data: data,
                    })];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
var FirebaseToken = /** @class */ (function () {
    function FirebaseToken() {
    }
    FirebaseToken.isValid = isValid;
    FirebaseToken.decode = decode;
    return FirebaseToken;
}());
exports.FirebaseToken = FirebaseToken;
var FirebaseNotification = /** @class */ (function () {
    function FirebaseNotification() {
    }
    FirebaseNotification.send = send;
    FirebaseNotification.sendToMany = sendToMany;
    return FirebaseNotification;
}());
exports.FirebaseNotification = FirebaseNotification;
//# sourceMappingURL=firebase-admin.js.map