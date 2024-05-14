"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAxiosClient = void 0;
var tslib_1 = require("tslib");
var axios_1 = tslib_1.__importDefault(require("axios"));
function getAxiosInstance(method) {
    switch (method) {
        case "GET":
            return axios_1.default.get;
        case "POST":
            return axios_1.default.post;
        case "PUT":
            return axios_1.default.put;
        case "PATCH":
            return axios_1.default.patch;
        case "DELETE":
            return axios_1.default.delete;
    }
}
function requestDataToUrl(url, requestData) {
    return url
        .split("/")
        .map(function (substring) { return substring.match(/\[([^\)]+)\]/); })
        .filter(function (substring) { return substring; })
        .reduce(function (newUrl, substring) {
        var _a;
        var urlKey = (substring !== null && substring !== void 0 ? substring : [])[0];
        var key = ((_a = (substring !== null && substring !== void 0 ? substring : [])[1]) !== null && _a !== void 0 ? _a : "").replace("...", "");
        var partialUrl = (function () {
            if (typeof requestData[key] === "string") {
                return newUrl.replace(urlKey, requestData[key]);
            }
            else if (urlKey.startsWith("[...")) {
                return newUrl.replace(urlKey, requestData[key].join("/"));
            }
            else {
                return newUrl.replace(urlKey, "");
            }
        })();
        requestData && delete requestData[key];
        console.log(requestData);
        return partialUrl;
    }, url);
}
function mapEndpointToAxiosClient(_a) {
    var _this = this;
    var endpoint = _a.endpoint, beforeRequest = _a.beforeRequest, afterRequest = _a.afterRequest, onError = _a.onError;
    var axiosInstance = getAxiosInstance(endpoint.method);
    return function (requestData, config) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, _a, _b, composedConfig, _c, _d, response, error_1;
        var _e, _f;
        return tslib_1.__generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    if (!["POST", "PUT", "PATCH"].includes(endpoint.method)) return [3 /*break*/, 1];
                    _a = requestData;
                    return [3 /*break*/, 3];
                case 1:
                    _b = [{}];
                    return [4 /*yield*/, beforeRequest(config !== null && config !== void 0 ? config : {})];
                case 2:
                    _a = tslib_1.__assign.apply(void 0, [tslib_1.__assign.apply(void 0, [tslib_1.__assign.apply(void 0, _b.concat([((_e = (_g.sent())) !== null && _e !== void 0 ? _e : {})])), { params: requestData }]), config]);
                    _g.label = 3;
                case 3:
                    data = _a;
                    if (!["POST", "PUT", "PATCH"].includes(endpoint.method)) return [3 /*break*/, 5];
                    _d = [{}];
                    return [4 /*yield*/, beforeRequest(config !== null && config !== void 0 ? config : {})];
                case 4:
                    _c = tslib_1.__assign.apply(void 0, [tslib_1.__assign.apply(void 0, _d.concat([((_f = (_g.sent())) !== null && _f !== void 0 ? _f : {})])), config]);
                    return [3 /*break*/, 6];
                case 5:
                    _c = undefined;
                    _g.label = 6;
                case 6:
                    composedConfig = _c;
                    _g.label = 7;
                case 7:
                    _g.trys.push([7, 10, , 12]);
                    return [4 /*yield*/, axiosInstance(requestDataToUrl(endpoint.url, requestData), data, composedConfig)];
                case 8:
                    response = _g.sent();
                    return [4 /*yield*/, afterRequest(response)];
                case 9:
                    _g.sent();
                    return [2 /*return*/, response];
                case 10:
                    error_1 = _g.sent();
                    return [4 /*yield*/, onError(error_1)];
                case 11:
                    _g.sent();
                    return [2 /*return*/, error_1
                            .response];
                case 12: return [2 /*return*/];
            }
        });
    }); };
}
function getAxiosClient(_a) {
    var _this = this;
    var endpoints = _a.endpoints, _b = _a.beforeRequest, beforeRequest = _b === void 0 ? function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
        return [2 /*return*/];
    }); }); } : _b, _c = _a.afterRequest, afterRequest = _c === void 0 ? function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
        return [2 /*return*/];
    }); }); } : _c, _d = _a.onError, onError = _d === void 0 ? function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
        return [2 /*return*/];
    }); }); } : _d;
    return Object.keys(endpoints).reduce(function (apiRoutes, endpoint) {
        var _a;
        return (tslib_1.__assign(tslib_1.__assign({}, apiRoutes), (_a = {}, _a[endpoint] = mapEndpointToAxiosClient({
            endpoint: endpoints[endpoint],
            beforeRequest: beforeRequest,
            afterRequest: afterRequest,
            onError: onError,
        }), _a)));
    }, {});
}
exports.getAxiosClient = getAxiosClient;
//# sourceMappingURL=get-axios-client.js.map