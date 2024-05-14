"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Page = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const styles_1 = require("@material-ui/core/styles");
const Box_1 = tslib_1.__importDefault(require("@material-ui/core/Box"));
const Paper_1 = tslib_1.__importDefault(require("@material-ui/core/Paper"));
const useMediaQuery_1 = tslib_1.__importDefault(require("@material-ui/core/useMediaQuery"));
const breadcrumbs_1 = require("./breadcrumbs");
function Page({ header, children, breadcrumbs, background, backgroundIsDark, paper = true, }) {
    const theme = styles_1.useTheme();
    const isDesktop = useMediaQuery_1.default(theme.breakpoints.up("sm"));
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Box_1.default, { paddingTop: isDesktop ? 8 : 2, paddingBottom: 24, paddingX: { xs: 2, sm: 2, md: 6 }, color: backgroundIsDark ? theme.palette.common.white : undefined, style: { background: background !== null && background !== void 0 ? background : theme.palette.primary.main } },
            react_1.default.createElement(Box_1.default, { maxWidth: "960px" }, header)),
        react_1.default.createElement(Box_1.default, { marginX: { xs: 2, sm: 2, md: 6 }, marginTop: -20, maxWidth: "960px" },
            react_1.default.createElement(Box_1.default, { color: backgroundIsDark ? theme.palette.common.white : undefined, marginBottom: 1 }, breadcrumbs !== undefined && breadcrumbs.length > 0 && (react_1.default.createElement(breadcrumbs_1.Breadcrumbs, { breadcrumbs: breadcrumbs }))),
            paper ? (react_1.default.createElement(Box_1.default, { marginBottom: isDesktop ? 6 : 2 },
                react_1.default.createElement(Paper_1.default, { elevation: 6 },
                    react_1.default.createElement(Box_1.default, { padding: { xs: 2, sm: 2, md: 3 } },
                        react_1.default.createElement(Box_1.default, null, children))))) : (children))));
}
exports.Page = Page;
//# sourceMappingURL=page.js.map