"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envEntry = void 0;
function envEntry(type_, name, value, default_) {
    const isClient = typeof window !== "undefined";
    const isPublicEntry = name.startsWith("NEXT_PUBLIC_") ||
        name.startsWith("REACT_APP_") ||
        name === "NODE_ENV";
    if (isClient && isPublicEntry === false) {
        return undefined;
    }
    const value_ = value
        ? value.replace(/(\r\n|\n|\r)/gm, "")
        : default_ !== null && default_ !== void 0 ? default_ : undefined;
    if (!value && !default_ && typeof window === "undefined") {
        throw new Error(`Entry value for "${name}" was not found in env.`);
    }
    switch (type_) {
        case "boolean":
            const isTrue = value_ === "true";
            const isFalse = value_ === "false";
            if (!isTrue && !isFalse) {
                throw new Error(`Entry value for "${name}" must be a boolean.`);
            }
            return isTrue;
        case "number":
            const number = Number(value_);
            const isNumber = !isNaN(number);
            if (!isNumber) {
                throw new Error(`Entry value for "${name}" must be a number.`);
            }
            return number;
        case "string":
            return (value_ !== null && value_ !== void 0 ? value_ : "").toString().replace(/\\n/g, "\n");
        default:
            return value_;
    }
}
exports.envEntry = envEntry;
//# sourceMappingURL=env-entry.js.map