"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createValidator = void 0;
const class_validator_1 = require("class-validator");
function createValidator({ name, constraintsLength, validate, }) {
    return function (...args) {
        return function (object, propertyName) {
            class_validator_1.registerDecorator({
                name,
                target: object.constructor,
                propertyName: propertyName,
                constraints: args.slice(0, constraintsLength),
                options: args[constraintsLength],
                validator: {
                    validate,
                },
            });
        };
    };
}
exports.createValidator = createValidator;
//# sourceMappingURL=create-validator.js.map