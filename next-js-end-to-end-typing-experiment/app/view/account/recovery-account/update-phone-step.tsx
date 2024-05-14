import InputMask from "react-input-mask";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useContext } from "@app/context";
import User from "@app/user/user.entity";
import isPhoneNumberUnique from "@api/users/is-phone-number-unique";
import useForm from "@app/http/use-form";
import { RecoveryAccountProps } from "./index";

export default function UpdatePhoneStep({
    firebaseAuthProps,
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
    } = useForm(isPhoneNumberUnique.enforceInput.post(User), {
        phoneNumber: "",
    });
    const [, setContext] = useContext();

    return (
        <>
            <Box marginBottom={1}>
                <Typography>
                    Ótimo! Agora você deve inserir um{" "}
                    <strong>novo número de celular</strong>. Este será o número
                    utilizado para você acessar a sua conta daqui em diante.
                </Typography>
            </Box>
            <form
                style={{
                    display: "flex",
                    flexDirection: "column",
                }}
                onSubmit={async (event) => {
                    event.preventDefault();
                    const { errors } = (await submitForm()).data;

                    if (errors.length > 0) {
                        return;
                    }

                    const success =
                        form.phoneNumber?.value !== undefined &&
                        (await firebaseAuthProps.requestCode(
                            form.phoneNumber?.value,
                        ));

                    if (success) {
                        setStep(3);
                        setFormState({
                            ...formState,
                            phoneNumber: form.phoneNumber?.value,
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
                <Box marginBottom={1}>
                    <InputMask
                        mask="(99) 99999-9999"
                        value={form.phoneNumber?.value}
                        disabled={loading || firebaseAuthProps.loading}
                        maskChar=" "
                        onFocus={() => setFormFocus("phoneNumber")}
                        onBlur={() => setFormBlur("phoneNumber")}
                        onChange={(event) =>
                            setForm({
                                phoneNumber: event.target.value,
                            })
                        }
                    >
                        {() => (
                            <TextField
                                label="Celular"
                                variant="outlined"
                                fullWidth
                                disabled={loading || firebaseAuthProps.loading}
                                error={
                                    form.phoneNumber?.touched &&
                                    form.phoneNumber?.errors.length > 0
                                }
                                helperText={
                                    form.phoneNumber?.touched &&
                                    form.phoneNumber?.errors[0]
                                }
                            />
                        )}
                    </InputMask>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={firebaseAuthProps.loading || loading}
                >
                    {firebaseAuthProps.loading || loading ? (
                        <CircularProgress />
                    ) : (
                        "Enviar código"
                    )}
                </Button>
            </form>
        </>
    );
}
