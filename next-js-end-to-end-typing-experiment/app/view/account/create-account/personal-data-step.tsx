import InputMask from "react-input-mask";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useContext } from "@app/context";
import { CreateAccountProps } from "./index";

export default function PersonalDataStep({
    setStep,
    formProps: {
        loading,
        form,
        submitForm,
        setForm,
        setFormFocus,
        setFormBlur,
    },
    firebaseAuthProps,
}: CreateAccountProps) {
    const [, setContext] = useContext();

    return (
        <form
            style={{ margin: "auto" }}
            onSubmit={async (event) => {
                event.preventDefault();
                const {
                    data: { errors },
                } = await submitForm();

                if (errors.length > 0) {
                    return;
                }

                const success =
                    form.phoneNumber?.value !== undefined &&
                    (await firebaseAuthProps.requestCode(
                        form.phoneNumber.value,
                    ));

                success && setStep(1);
                !success &&
                    setContext({
                        snackbar: [
                            "Houve um erro de conexão. Por favor, tente novamente.",
                            "error",
                        ],
                    });
            }}
        >
            <Grid container spacing={1}>
                <Grid item xs={12} md={5}>
                    <TextField
                        fullWidth
                        label="Nome"
                        variant="outlined"
                        value={form.name?.value}
                        disabled={firebaseAuthProps.loading || loading}
                        error={
                            form.name?.touched && form.name?.errors.length > 0
                        }
                        helperText={form.name?.touched && form.name?.errors[0]}
                        onFocus={() => setFormFocus("name")}
                        onBlur={() => setFormBlur("name")}
                        onChange={(event) =>
                            setForm({
                                name: event.target.value,
                            })
                        }
                    />
                </Grid>
                <Grid item xs={12} md={7}>
                    <TextField
                        fullWidth
                        label="Sobrenome"
                        variant="outlined"
                        value={form.surname?.value}
                        disabled={firebaseAuthProps.loading || loading}
                        error={
                            form.surname?.touched &&
                            form.surname?.errors.length > 0
                        }
                        helperText={
                            form.surname?.touched && form.surname?.errors[0]
                        }
                        onFocus={() => setFormFocus("surname")}
                        onBlur={() => setFormBlur("surname")}
                        onChange={(event) =>
                            setForm({
                                surname: event.target.value,
                            })
                        }
                    />
                </Grid>
                <Grid item xs={12}>
                    <InputMask
                        mask="999.999.999-99"
                        value={form.cpf?.value}
                        disabled={firebaseAuthProps.loading || loading}
                        maskChar=" "
                        onFocus={() => setFormFocus("cpf")}
                        onBlur={() => setFormBlur("cpf")}
                        onChange={(event) =>
                            setForm({
                                cpf: event.target.value,
                            })
                        }
                    >
                        {() => (
                            <TextField
                                fullWidth
                                label="CPF"
                                variant="outlined"
                                error={
                                    form.cpf?.touched &&
                                    form.cpf?.errors.length > 0
                                }
                                helperText={
                                    form.cpf?.touched && form.cpf?.errors[0]
                                }
                            />
                        )}
                    </InputMask>
                </Grid>
                <Grid item xs={12} md={7}>
                    <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        value={form.email?.value}
                        disabled={firebaseAuthProps.loading || loading}
                        error={
                            form.email?.touched && form.email?.errors.length > 0
                        }
                        helperText={
                            form.email?.touched && form.email?.errors[0]
                        }
                        onFocus={() => setFormFocus("email")}
                        onBlur={() => setFormBlur("email")}
                        onChange={(event) =>
                            setForm({ email: event.target.value })
                        }
                    />
                </Grid>
                <Grid item xs={12} md={5}>
                    <InputMask
                        mask="(99) 99999-9999"
                        value={form.phoneNumber?.value}
                        disabled={firebaseAuthProps.loading || loading}
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
                                fullWidth
                                label="Celular"
                                variant="outlined"
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
                </Grid>
                <Grid item xs={12}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={firebaseAuthProps.loading || loading}
                    >
                        {firebaseAuthProps.loading || loading ? (
                            <CircularProgress />
                        ) : (
                            "Verificar celular"
                        )}
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}
