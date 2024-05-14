"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jwt = void 0;
const tslib_1 = require("tslib");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
function encode(payload, options) {
    var _a;
    try {
        const token = jsonwebtoken_1.default.sign(payload, (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : "secret", options);
        return token;
    }
    catch (_b) {
        return undefined;
    }
}
function decode(token, options) {
    var _a;
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : "secret", options);
        return decodedToken;
    }
    catch (_b) {
        return undefined;
    }
}
function extractTokenFromHeader(req) {
    var _a;
    if ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.startsWith("Bearer ")) {
        const token = req.headers.authorization.substring(7, req.headers.authorization.length);
        return token;
    }
    return undefined;
}
class Jwt {
}
exports.Jwt = Jwt;
Jwt.encode = encode;
Jwt.decode = decode;
Jwt.extractTokenFromHeader = extractTokenFromHeader;
//# sourceMappingURL=jwt.js.map