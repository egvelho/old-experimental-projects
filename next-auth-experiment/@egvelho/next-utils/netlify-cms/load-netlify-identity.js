"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadNetlifyIdentity = void 0;
const tslib_1 = require("tslib");
function loadNetlifyIdentity() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (typeof window !== "undefined" &&
            window.location.href.includes("#invite_token=")) {
            const script = document.createElement("script");
            script.src = "https://identity.netlify.com/v1/netlify-identity-widget.js";
            script.async = true;
            document.body.appendChild(script);
            while (window.netlifyIdentity === undefined) {
                yield new Promise((resolve) => setTimeout(resolve, 1000));
            }
            window.netlifyIdentity.on("init", (user) => {
                if (!user) {
                    window.netlifyIdentity.on("login", () => {
                        document.location.href = "/admin/";
                    });
                }
            });
        }
    });
}
exports.loadNetlifyIdentity = loadNetlifyIdentity;
//# sourceMappingURL=load-netlify-identity.js.map