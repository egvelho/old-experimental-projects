import { useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Login from "./login";
import CreateAccount from "./create-account";
import RecoveryAccount from "./recovery-account";

export type AccountView =
    | undefined
    | "login"
    | "recovery-account"
    | "create-account";

export interface AccountViewProps {
    view: AccountView;
    setView: (view: AccountView) => void;
}

function SwitchView({ view, setView }: AccountViewProps) {
    switch (view) {
        case "login":
            return <Login view={view} setView={setView} />;
        case "create-account":
            return <CreateAccount view={view} setView={setView} />;
        case "recovery-account":
            return <RecoveryAccount view={view} setView={setView} />;
        default:
            return null;
    }
}

export default function Account({ view, setView }: AccountViewProps) {
    const [initialView, setInitialView] = useState(undefined as AccountView);
    const [navigation, setNavigation] = useState([] as AccountView[]);

    useEffect(() => {
        if (view !== undefined && initialView === undefined) {
            setInitialView(view);
        }

        if (view === undefined) {
            setInitialView(undefined);
            setNavigation([]);
        } else {
            setNavigation([...navigation, view]);
        }
    }, [view]);

    return (
        <Dialog
            open={view !== undefined}
            onClose={() => setView(undefined)}
            scroll="body"
        >
            {view !== initialView && (
                <DialogContent>
                    <IconButton
                        onClick={() =>
                            setView(navigation[navigation.length - 2])
                        }
                        edge="start"
                        color="inherit"
                        aria-label="Voltar"
                    >
                        <ArrowBackIcon fontSize="large" />
                    </IconButton>
                </DialogContent>
            )}
            <SwitchView view={view} setView={(view) => setView(view)} />
        </Dialog>
    );
}
