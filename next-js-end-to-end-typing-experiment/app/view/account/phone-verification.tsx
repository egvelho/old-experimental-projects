import { useState } from "react";
import InputMask from "react-input-mask";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import User from "@app/user/user.entity";
import { useContext } from "@app/context";
import { UseFirebaseAuth } from "@app/firebase";

export interface PhoneVerificationProps {
    firebaseAuthProps: UseFirebaseAuth;
    user: User;
    finishButtonText?: string;
    onFinish: (user: User) => Promise<void>;
    requestUser: (user: User) => Promise<User | undefined>;
}

export default function PhoneVerificationStep({
    firebaseAuthProps,
    user,
    finishButtonText = "Enviar",
    requestUser,
    onFinish,
}: PhoneVerificationProps) {
    const [, setContext] = useContext();

    const [state, setState] = useState({
        confirmationCode: "",
        error: false,
    });

    const { error, confirmationCode } = state;

    return (
        <>
            <Box marginBottom={1}>
                <Typography>
                    Por favor, insira o código de verificação enviado para o
                    número <strong>{user.phoneNumber}</strong>. Caso você não
                    tenha recebido a mensagem no seu celular, podemos{" "}
                    <Link
                        style={{ cursor: "pointer" }}
                        onClick={async () => {
                            const success =
                                user.phoneNumber !== undefined &&
                                (await firebaseAuthProps.requestCode(
                                    user.phoneNumber,
                                ));

                            if (success) {
                                setContext({
                                    snackbar: [
                                        "Um novo código de verificação foi enviado.",
                                        "success",
                                    ],
                                });
                            } else {
                                setContext({
                                    snackbar: [
                                        "Houve um erro de conexão. Por favor, tente novamente.",
                                        "error",
                                    ],
                                });
                            }
                        }}
                    >
                        enviar novamente
                    </Link>
                    .
                </Typography>
            </Box>
            <form
                onSubmit={async (event) => {
                    event.preventDefault();
                    const verifyCodeSuccess = await firebaseAuthProps.verifyCode(
                        confirmationCode,
                    );

                    if (!verifyCodeSuccess) {
                        setState({ ...state, error: true });
                        return;
                    }

                    const maybeUser = await requestUser(user);

                    if (!maybeUser) {
                        setContext({
                            snackbar: [
                                "Houve um erro de conexão. Por favor, tente novamente.",
                                "error",
                            ],
                        });
                        return;
                    }

                    setContext({ user: maybeUser });
                    onFinish(maybeUser);
                }}
            >
                <Box marginBottom={1}>
                    <InputMask
                        mask="999999"
                        value={confirmationCode}
                        disabled={firebaseAuthProps.loading}
                        maskChar=" "
                        onBlur={() => setState({ ...state, error: false })}
                        onFocus={() => setState({ ...state, error: false })}
                        onChange={(event) =>
                            setState({
                                ...state,
                                confirmationCode: event.target.value,
                            })
                        }
                    >
                        {() => (
                            <TextField
                                fullWidth
                                label="Código de verificação"
                                variant="outlined"
                                error={error}
                                helperText={
                                    error &&
                                    "O código foi digitado incorretamente. Por favor, tente novamente."
                                }
                            />
                        )}
                    </InputMask>
                </Box>
                <Button
                    disabled={firebaseAuthProps.loading}
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                >
                    {firebaseAuthProps.loading ? (
                        <CircularProgress />
                    ) : (
                        finishButtonText
                    )}
                </Button>
            </form>
        </>
    );
}
