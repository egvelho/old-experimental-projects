"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchHeader = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const styles_1 = require("@material-ui/core/styles");
const useMediaQuery_1 = tslib_1.__importDefault(require("@material-ui/core/useMediaQuery"));
const Typography_1 = tslib_1.__importDefault(require("@material-ui/core/Typography"));
const Chip_1 = tslib_1.__importDefault(require("@material-ui/core/Chip"));
const Box_1 = tslib_1.__importDefault(require("@material-ui/core/Box"));
const TextField_1 = tslib_1.__importDefault(require("@material-ui/core/TextField"));
const styles_2 = require("@material-ui/core/styles");
const Autocomplete_1 = tslib_1.__importDefault(require("@material-ui/lab/Autocomplete"));
const Search_1 = tslib_1.__importDefault(require("@material-ui/icons/Search"));
function SearchHeader({ title, background, searchOptions, searchDefaultValue, searchPlaceholder, searchNoOptionsText, searchDisabled, loading, dark, searchMultiple = false, onSearchSelect = () => tslib_1.__awaiter(this, void 0, void 0, function* () { }), }) {
    var _a;
    const theme = styles_2.useTheme();
    const isDesktop = useMediaQuery_1.default(theme.breakpoints.up("sm"));
    const searchClasses = searchStyles({ dark });
    return (react_1.default.createElement(Box_1.default, { style: {
            background: background !== null && background !== void 0 ? background : theme.palette.primary.main,
        }, height: isDesktop ? "394px" : "256px", display: "flex", alignItems: "center", justifyContent: "flex-end", flexDirection: "column" },
        react_1.default.createElement(Box_1.default, { maxWidth: "960px", minWidth: isDesktop ? "480px" : "100%" },
            react_1.default.createElement(Box_1.default, { marginBottom: 1.6, marginX: isDesktop ? undefined : 1.6 },
                react_1.default.createElement(Typography_1.default, { variant: isDesktop ? "h3" : "h5", component: "h1", style: {
                        textAlign: "center",
                        fontWeight: "bold",
                        color: dark ? theme.palette.common.white : undefined,
                    } }, title)),
            react_1.default.createElement(Box_1.default, { marginX: isDesktop ? undefined : 1.6, marginBottom: isDesktop ? 6.4 : 1.6 },
                react_1.default.createElement(Autocomplete_1.default, { multiple: searchMultiple, disableCloseOnSelect: true, blurOnSelect: true, fullWidth: true, openText: "", clearText: "", closeText: "", loadingText: "", classes: searchClasses, options: searchOptions, defaultValue: searchMultiple
                        ? Array.isArray(searchDefaultValue)
                            ? searchDefaultValue
                            : [searchDefaultValue]
                        : Array.isArray(searchDefaultValue)
                            ? (_a = searchDefaultValue[0]) !== null && _a !== void 0 ? _a : undefined : searchDefaultValue, getOptionLabel: (option) => option, loading: loading, disabled: searchDisabled, noOptionsText: searchNoOptionsText, popupIcon: react_1.default.createElement(Search_1.default, { color: "inherit" }), onChange: (_, value) => {
                        if (value === null) {
                            onSearchSelect([]);
                        }
                        else if (Array.isArray(value)) {
                            onSearchSelect(value);
                        }
                        else {
                            onSearchSelect([value]);
                        }
                    }, renderTags: (value, getTagProps) => value.map((option, index) => (react_1.default.createElement(Chip_1.default, Object.assign({ label: option }, getTagProps({ index }))))), renderInput: (params) => (react_1.default.createElement(TextField_1.default, Object.assign({}, params, { variant: "outlined", placeholder: searchPlaceholder }))) })))));
}
exports.SearchHeader = SearchHeader;
const searchStyles = styles_1.makeStyles((theme) => ({
    inputRoot: {
        color: ({ dark }) => dark ? theme.palette.common.white : "inherit",
        backgroundColor: ({ dark }) => dark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
        },
        "& .MuiIconButton-label": {
            color: ({ dark }) => dark ? theme.palette.common.white : "inherit",
        },
    },
}));
//# sourceMappingURL=search-header.js.map