"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const tslib_1 = require("tslib");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const class_sanitizer_1 = require("class-sanitizer");
function parse(constructor, object, groups) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const instance = class_transformer_1.plainToClass(constructor, object, {
            ignoreDecorators: true,
        });
        class_sanitizer_1.sanitize(instance);
        return [
            instance,
            yield class_validator_1.validate(instance, {
                forbidUnknownValues: true,
                dismissDefaultMessages: true,
                groups,
            }),
        ];
    });
}
exports.parse = parse;
//# sourceMappingURL=parse.js.map