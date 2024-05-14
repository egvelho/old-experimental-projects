"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoResults = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const styles_1 = require("@material-ui/core/styles");
const useMediaQuery_1 = tslib_1.__importDefault(require("@material-ui/core/useMediaQuery"));
const Typography_1 = tslib_1.__importDefault(require("@material-ui/core/Typography"));
const Box_1 = tslib_1.__importDefault(require("@material-ui/core/Box"));
function NoResults({ noResultsText }) {
    const theme = styles_1.useTheme();
    const isDesktop = useMediaQuery_1.default(theme.breakpoints.up("sm"));
    return (react_1.default.createElement(Box_1.default, { width: "100%", textAlign: "center", paddingY: isDesktop ? 8 : 4 },
        react_1.default.createElement(Typography_1.default, { variant: isDesktop ? "h5" : "h6", component: "span", style: {
                fontWeight: 400,
            } }, noResultsText)));
}
exports.NoResults = NoResults;
//# sourceMappingURL=no-results.js.map