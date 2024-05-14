"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactForm = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const Box_1 = tslib_1.__importDefault(require("@material-ui/core/Box"));
const Grid_1 = tslib_1.__importDefault(require("@material-ui/core/Grid"));
const TextField_1 = tslib_1.__importDefault(require("@material-ui/core/TextField"));
const Button_1 = tslib_1.__importDefault(require("@material-ui/core/Button"));
const Typography_1 = tslib_1.__importDefault(require("@material-ui/core/Typography"));
const CircularProgress_1 = tslib_1.__importDefault(require("@material-ui/core/CircularProgress"));
const styles_1 = require("@material-ui/core/styles");
const styles_2 = require("@material-ui/core/styles");
const useMediaQuery_1 = tslib_1.__importDefault(require("@material-ui/core/useMediaQuery"));
function ContactForm({ onSubmit, form, submitButtonLabel, loading, title, titleColor, backgroundIsDark, background, }) {
    const theme = styles_1.useTheme();
    const styles = useStyles({ backgroundIsDark });
    const isDesktop = useMediaQuery_1.default(theme.breakpoints.up("sm"));
    return (react_1.default.createElement(Box_1.default, { paddingY: isDesktop ? 16 : 8, paddingX: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", style: {
            background,
            backgroundSize: "cover",
        } },
        react_1.default.createElement(Box_1.default, { maxWidth: 960, marginX: "auto" },
            react_1.default.createElement(Box_1.default, { marginBottom: 4, color: titleColor },
                react_1.default.createElement(Typography_1.default, { align: "center", variant: isDesktop ? "h3" : "h5", component: "h1" }, title)),
            react_1.default.createElement("form", { style: { margin: "auto" }, onSubmit: (event) => {
                    event.preventDefault();
                    onSubmit(form);
                } },
                react_1.default.createElement(Grid_1.default, { container: true, spacing: 1 },
                    react_1.default.createElement(Grid_1.default, { item: true, xs: 12 },
                        react_1.default.createElement(TextField_1.default, { label: form.name.label, value: form.name.value, error: form.name.error, helperText: form.name.helperText, onFocus: form.name.onFocus, onBlur: form.name.onBlur, onChange: (event) => form.name.onChange(event.target.value), fullWidth: true, variant: "outlined", disabled: loading, className: styles.textField, name: "name", autoComplete: "off" })),
                    react_1.default.createElement(Grid_1.default, { item: true, xs: 12, md: 7 },
                        react_1.default.createElement(TextField_1.default, { label: form.email.label, value: form.email.value, error: form.email.error, helperText: form.email.helperText, onFocus: form.email.onFocus, onBlur: form.email.onBlur, onChange: (event) => form.email.onChange(event.target.value), fullWidth: true, variant: "outlined", disabled: loading, className: styles.textField, name: "email", autoComplete: "off" })),
                    react_1.default.createElement(Grid_1.default, { item: true, xs: 12, md: 5 },
                        react_1.default.createElement(TextField_1.default, { label: form.phoneNumber.label, value: form.phoneNumber.value, error: form.phoneNumber.error, helperText: form.phoneNumber.helperText, onFocus: form.phoneNumber.onFocus, onBlur: form.phoneNumber.onBlur, onChange: (event) => form.phoneNumber.onChange(event.target.value), fullWidth: true, variant: "outlined", disabled: loading, className: styles.textField, name: "phone-number", autoComplete: "off" })),
                    react_1.default.createElement(Grid_1.default, { item: true, xs: 12 },
                        react_1.default.createElement(TextField_1.default, { label: form.message.label, value: form.message.value, error: form.message.error, helperText: form.message.helperText, onFocus: form.message.onFocus, onBlur: form.message.onBlur, onChange: (event) => form.message.onChange(event.target.value), fullWidth: true, multiline: true, rows: isDesktop ? 4 : 8, variant: "outlined", disabled: loading, className: styles.textField, name: "message", autoComplete: "off" })),
                    react_1.default.createElement(Grid_1.default, { item: true, xs: 12, style: {
                            justifyContent: "flex-end",
                            display: "flex",
                        } },
                        react_1.default.createElement(Button_1.default, { type: "submit", variant: "contained", color: "primary", fullWidth: isDesktop === false, disabled: loading }, loading ? react_1.default.createElement(CircularProgress_1.default, null) : submitButtonLabel)))))));
}
exports.ContactForm = ContactForm;
const useStyles = styles_2.makeStyles((theme) => ({
    textField: {
        "& .MuiInputBase-input": {
            color: ({ backgroundIsDark }) => backgroundIsDark ? theme.palette.common.white : "inherit",
        },
        "& .MuiFormLabel-root": {
            color: ({ backgroundIsDark }) => backgroundIsDark ? "rgba(255, 255, 255, 0.54)" : "rgba(0, 0, 0, 0.54)",
        },
        "& .MuiFormHelperText-root:not(.Mui-error)": {
            color: ({ backgroundIsDark }) => backgroundIsDark ? "rgba(255, 255, 255, 0.54)" : "rgba(0, 0, 0, 0.54)",
        },
        "& .MuiOutlinedInput-root": {
            "& fieldset": {
                borderColor: ({ backgroundIsDark }) => backgroundIsDark
                    ? "rgba(255, 255, 255, 0.23)"
                    : "rgba(0, 0, 0, 0.23)",
            },
            "&:hover fieldset": {
                borderColor: ({ backgroundIsDark }) => backgroundIsDark
                    ? "rgba(255, 255, 255, 0.23)"
                    : "rgba(0, 0, 0, 0.23)",
            },
        },
    },
}));
//# sourceMappingURL=contact-form.js.map