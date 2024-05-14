"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BottomNavigation = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const BottomNavigation_1 = tslib_1.__importDefault(require("@material-ui/core/BottomNavigation"));
const BottomNavigationAction_1 = tslib_1.__importDefault(require("@material-ui/core/BottomNavigationAction"));
const link_1 = tslib_1.__importDefault(require("next/link"));
const router_1 = require("next/router");
function BottomNavigation({ items }) {
    const [value, setValue] = react_1.default.useState(undefined);
    const router = router_1.useRouter();
    function mapItemToValue(item) {
        const hash = window.location.hash;
        const url = router.pathname.concat(hash);
        if ("href" in item &&
            item.href
                .concat(item.href.endsWith("/") ? "" : "/")
                .startsWith(url.concat(url.endsWith("/") ? "" : "/"))) {
            return item.href;
        }
        else {
            return undefined;
        }
    }
    const getValue = () => items
        .map((item) => mapItemToValue(item))
        .concat(undefined)
        .sort()[0];
    react_1.default.useEffect(() => {
        setValue(getValue());
    }, []);
    react_1.default.useEffect(() => {
        setValue(getValue());
    }, [router.pathname]);
    return (react_1.default.createElement(BottomNavigation_1.default, { value: value, onChange: (_, nextValue) => {
            if (!router.pathname.startsWith(nextValue)) {
                setValue(nextValue);
            }
        }, style: {
            width: "100%",
            position: "sticky",
            bottom: 0,
        }, showLabels: true }, items.map((_a, index) => {
        var { label, Icon } = _a, item = tslib_1.__rest(_a, ["label", "Icon"]);
        return "href" in item ? (react_1.default.createElement(link_1.default, { href: item.href, passHref: true, key: `bottom-navigation-item-${index}` },
            react_1.default.createElement(BottomNavigationAction_1.default, { component: "a", value: item.href, label: label, icon: react_1.default.createElement(Icon, null), showLabel: true, className: item.href === value ? "Mui-selected" : undefined }))) : (react_1.default.createElement(BottomNavigationAction_1.default, { key: `bottom-navigation-item-${index}`, value: `bottom-navigation-item-${index}`, onClick: item.onClick, label: label, icon: react_1.default.createElement(Icon, null), showLabel: true, style: {
                cursor: "pointer",
            } }));
    })));
}
exports.BottomNavigation = BottomNavigation;
//# sourceMappingURL=bottom-navigation.js.map