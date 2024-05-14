import MuiSnackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import { Context } from "@app/context";

export default function Snackbar({
    snackbar: [message, severity],
    setSnackbar,
}: {
    snackbar: Context["snackbar"];
    setSnackbar: (context: Context["snackbar"]) => void;
}) {
    return (
        <>
            {message && (
                <MuiSnackbar
                    open={message !== undefined}
                    autoHideDuration={6000}
                    onClose={() => setSnackbar([undefined, undefined])}
                >
                    <Alert
                        onClose={() => setSnackbar([undefined, undefined])}
                        severity={severity ?? "info"}
                    >
                        {message}
                    </Alert>
                </MuiSnackbar>
            )}
        </>
    );
}
