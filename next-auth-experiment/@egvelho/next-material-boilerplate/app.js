"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
function app({ theme, Layout, ThemeProvider, CssBaseline, }) {
    return function App({ Component, pageProps }) {
        react_1.default.useEffect(() => {
            var _a;
            const jssStyles = document.querySelector("#jss-server-side");
            if (jssStyles) {
                (_a = jssStyles.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(jssStyles);
            }
        }, []);
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(ThemeProvider, { theme: theme },
                react_1.default.createElement(CssBaseline, null),
                react_1.default.createElement(Layout, null,
                    react_1.default.createElement(Component, Object.assign({}, pageProps))))));
    };
}
exports.app = app;
//# sourceMappingURL=app.js.map