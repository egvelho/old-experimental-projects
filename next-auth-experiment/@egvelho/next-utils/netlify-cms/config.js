"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCmsConfig = exports.folder = exports.file = exports.files = void 0;
const tslib_1 = require("tslib");
const slug_1 = tslib_1.__importDefault(require("slug"));
function files(label, files) {
    return {
        name: slug_1.default(label),
        label,
        format: "json",
        files,
    };
}
exports.files = files;
function file(label, file, fields) {
    return {
        name: slug_1.default(label),
        label,
        file,
        fields,
    };
}
exports.file = file;
function folder(options, fields) {
    var _a, _b;
    return Object.assign(Object.assign({}, options), { name: options.label ? slug_1.default(options.label) : options.name, label: options.label, label_singular: options.label_singular, folder: options.folder, create: (_a = options.create) !== null && _a !== void 0 ? _a : true, format: (_b = options.format) !== null && _b !== void 0 ? _b : "json", fields: fields !== null && fields !== void 0 ? fields : options.fields });
}
exports.folder = folder;
function getCmsConfig({ locale = "pt", localBackend = "http://localhost:8081/api/v1", collections = [], }) {
    var _a, _b;
    return {
        config: {
            locale,
            backend: {
                name: "git-gateway",
            },
            local_backend: process.env.NODE_ENV === "development"
                ? {
                    url: localBackend,
                }
                : {},
            publish_mode: process.env.NODE_ENV === "development"
                ? undefined
                : "editorial_workflow",
            load_config_file: false,
            media_folder: "public/images",
            public_folder: "/images",
            site_url: (_b = (_a = process.env.NEXT_PUBLIC_URL) !== null && _a !== void 0 ? _a : process.env.REACT_APP_URL) !== null && _b !== void 0 ? _b : process.env.URL,
            logo_url: "/android-chrome-96x96.png",
            show_preview_links: false,
            editor: {
                preview: false,
            },
            slug: {
                encoding: "unicode",
                clean_accents: true,
                sanitize_replacement: "-",
            },
            collections,
        },
    };
}
exports.getCmsConfig = getCmsConfig;
//# sourceMappingURL=config.js.map