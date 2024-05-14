import { useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import User from "@app/user/user.entity";
import { useContext } from "@app/context";
import useForm from "@app/http/use-form";
import recoveryAccount from "@api/recovery-account";
import { RecoveryAccountProps } from "./index";

export default function EmailCodeStep({
    formState,
    setFormState,
    setStep,
}: RecoveryAccountProps) {
    const {
        form,
        setForm,
        setFormFocus,
        setFormBlur,
        submitForm,
        loading,
    } = useForm(recoveryAccount.enforceInput.post(User), {
        email: "",
    });
    const [context, setContext] = useContext();

    const onFormSubmit = async () => {
        const response = (await submitForm()).data;
        const recoveryToken = response?.output;

        if (response.errors.length > 0) {
            const errors = response.errors
                .map(({ constraints }) => Object.keys(constraints))
                .flat();

            if (errors.length === 1 && errors[0] === "isEmailVerified") {
                setContext({ verifyEmail: form.email?.value });
            }

            return;
        }

        if (recoveryToken) {
            setFormState({
                ...formState,
                recoveryToken,
                email: form.email?.value,
            });
            setStep(1);
        } else {
            setContext({
                snackbar: [
                    "Houve um erro de conexão. Por favor, tente novamente.",
                    "error",
                ],
            });
        }
    };

    useEffect(() => {
        if (
            context.verifyEmail === undefined &&
            form.email !== undefined &&
            form.email.errors.length > 0
        ) {
            onFormSubmit();
        }
    }, [context.verifyEmail]);

    return (
        <>
            <Box marginBottom={1}>
                <Typography>
                    Por favor, informe o email que foi utilizado no cadastro da
                    sua conta.
                </Typography>
            </Box>
            <form
                style={{
                    display: "flex",
                    flexDirection: "column",
                }}
                onSubmit={async (event) => {
                    event.preventDefault();
                    onFormSubmit();
                }}
            >
                <Box marginBottom={1}>
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        value={form.email?.value}
                        disabled={loading}
                        helperText={
                            form.email?.touched && form.email?.errors[0]
                        }
                        onFocus={() => setFormFocus("email")}
                        onBlur={() => setFormBlur("email")}
                        error={
                            form.email?.touched && form.email?.errors.length > 0
                        }
                        onChange={(event) =>
                            setForm({
                                email: event.target.value,
                            })
                        }
                    />
                </Box>
                <Button
                    disabled={loading}
                    variant="contained"
                    color="primary"
                    type="submit"
                >
                    {loading ? <CircularProgress /> : "Enviar email"}
                </Button>
            </form>
        </>
    );
}
