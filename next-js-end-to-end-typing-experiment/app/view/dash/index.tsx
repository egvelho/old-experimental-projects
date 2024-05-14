import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MenuIcon from "@material-ui/icons/Menu";
import app from "@root/app.json";
import theme from "@app/view/theme";
import { useContext } from "@app/context";
import Account from "@app/view/account";
import VerifyEmail from "@app/view/account/verify-email";
import Drawer from "./drawer";
import Snackbar from "./snackbar";

export default function Dash({ children }: { children: JSX.Element }) {
    const [context, setContext] = useContext();

    return (
        <div>
            <Account
                view={context.accountView}
                setView={(accountView) => setContext({ accountView })}
            />
            <VerifyEmail
                email={context.verifyEmail}
                setEmail={(verifyEmail) => setContext({ verifyEmail })}
            />
            <Snackbar
                snackbar={context.snackbar}
                setSnackbar={(snackbar) => setContext({ snackbar })}
            />
            <AppBar
                position="sticky"
                style={{
                    backgroundColor: app.dashColor,
                    color: theme.palette.primary.main,
                }}
            >
                <Toolbar>
                    <IconButton
                        onClick={() =>
                            setContext({
                                drawerOpen: !context.drawerOpen,
                            })
                        }
                        edge="start"
                        color="inherit"
                        aria-label="Abrir menu"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        component="h1"
                        variant="h6"
                        color="inherit"
                        style={{
                            flex: 1,
                        }}
                    >
                        {app.shortName}
                    </Typography>
                    {context.user ? (
                        <Typography>
                            {context.user.name} {context.user.surname}
                        </Typography>
                    ) : (
                        <Button variant="contained" color="primary">
                            Enviar meu TCC
                        </Button>
                    )}
                </Toolbar>
            </AppBar>
            <Drawer
                open={context.drawerOpen}
                onClose={() => setContext({ drawerOpen: false })}
            />
            <main>{children}</main>
        </div>
    );
}
