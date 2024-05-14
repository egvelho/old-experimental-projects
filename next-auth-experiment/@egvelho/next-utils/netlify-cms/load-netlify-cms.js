"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadNetlifyCMS = void 0;
const tslib_1 = require("tslib");
function loadNetlifyCMS(cmsConfig) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (document.querySelector("#nc-root") !== null) {
            window.location.reload();
            return;
        }
        window.CMS_MANUAL_INIT = true;
        const html = document.querySelector("html");
        html &&
            (html.innerHTML = `<!doctype html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Content Manager</title><style>#nc-root span[class*="CustomIconWrapper"] img[alt="Logo"] { display: block; margin-left: auto; margin-right: auto; }</style></head><body></body></html>`);
        let script = document.createElement("script");
        script.src = "https://identity.netlify.com/v1/netlify-identity-widget.js";
        document.body.appendChild(script);
        while (window.netlifyIdentity === undefined) {
            yield new Promise((resolve) => setTimeout(resolve, 1000));
        }
        script = document.createElement("script");
        script.src = "https://unpkg.com/netlify-cms@^2.0.0/dist/netlify-cms.js";
        document.body.appendChild(script);
        while (window.initCMS === undefined) {
            yield new Promise((resolve) => setTimeout(resolve, 1000));
        }
        script = document.createElement("script");
        script.innerHTML = `window.netlifyIdentity.on("logout", function() { document.body.innerHTML = ""; document.location.href = "/"; }); window.initCMS(${JSON.stringify(cmsConfig)})`;
        document.body.appendChild(script);
    });
}
exports.loadNetlifyCMS = loadNetlifyCMS;
//# sourceMappingURL=load-netlify-cms.js.map