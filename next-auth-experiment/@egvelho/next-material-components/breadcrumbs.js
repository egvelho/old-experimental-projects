"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Breadcrumbs = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const link_1 = tslib_1.__importDefault(require("next/link"));
const core_1 = require("@material-ui/core");
const styles_1 = require("@material-ui/core/styles");
const useMediaQuery_1 = tslib_1.__importDefault(require("@material-ui/core/useMediaQuery"));
const Link_1 = tslib_1.__importDefault(require("@material-ui/core/Link"));
const Breadcrumbs_1 = tslib_1.__importDefault(require("@material-ui/core/Breadcrumbs"));
const NavigateNext_1 = tslib_1.__importDefault(require("@material-ui/icons/NavigateNext"));
function Breadcrumbs({ breadcrumbs }) {
    const theme = styles_1.useTheme();
    const isDesktop = useMediaQuery_1.default(theme.breakpoints.up("sm"));
    const styles = useStyles({ isDesktop });
    return (react_1.default.createElement(Breadcrumbs_1.default, { className: styles.root, color: "inherit", separator: react_1.default.createElement(NavigateNext_1.default, { fontSize: "small" }) }, breadcrumbs.map(([label, href], index) => (react_1.default.createElement(link_1.default, { href: href, passHref: true, key: `page-breadcrumb-link-${index}` },
        react_1.default.createElement(Link_1.default, { color: "inherit" }, label))))));
}
exports.Breadcrumbs = Breadcrumbs;
const useStyles = core_1.makeStyles({
    root: {
        "& .MuiBreadcrumbs-ol": {
            justifyContent: ({ isDesktop }) => isDesktop ? "start" : "center",
        },
    },
});
//# sourceMappingURL=breadcrumbs.js.map