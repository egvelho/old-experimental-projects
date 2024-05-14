import app from "@root/app.json";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: app.primaryColor,
        },
        secondary: {
            main: app.secondaryColor,
        },
        background: {
            default: app.backgroundColor,
        },
    },
});

export default theme;
