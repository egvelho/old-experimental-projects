"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApiRoutes = void 0;
var tslib_1 = require("tslib");
function mapEndpointToApiRoute(endpoint) {
    var _this = this;
    return function (callback) { return function (request, response) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(request.method === endpoint.method)) return [3 /*break*/, 2];
                    _b = (_a = response
                        .status(200))
                        .json;
                    return [4 /*yield*/, callback(tslib_1.__assign(tslib_1.__assign({}, request.query), request.body), request, response)];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    _c.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); }; };
}
function getApiRoutes(endpoints) {
    return Object.keys(endpoints).reduce(function (apiRoutes, endpoint) {
        var _a;
        return (tslib_1.__assign(tslib_1.__assign({}, apiRoutes), (_a = {}, _a[endpoint] = mapEndpointToApiRoute(endpoints[endpoint]), _a)));
    }, {});
}
exports.getApiRoutes = getApiRoutes;
//# sourceMappingURL=get-api-routes.js.map