import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useContext } from "@app/context";
import recoveryAccount from "@api/recovery-account";
import { UserWithCode } from "@api/recovery-account/[code]/index";
import checkCode from "@api/recovery-account/[code]/check";
import useForm from "@app/http/use-form";
import { RecoveryAccountProps } from "./index";

export default function VerifyCodeStep({
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
    } = useForm(checkCode.enforceInput.post(UserWithCode), {
        recoveryToken: formState.recoveryToken,
        code: "",
    } as UserWithCode);
    const [, setContext] = useContext();

    return (
        <>
            <Box marginBottom={1}>
                <Typography>
                    Insira o código de verificação enviado para{" "}
                    <strong>{formState.email}</strong>. Caso você não encontre
                    este email na sua <strong>caixa de entrada</strong>, por
                    favor, verifique a <strong>lixeira</strong> ou a{" "}
                    <strong>caixa de spam</strong>. Se você esperou mais de{" "}
                    <strong>5 minutos</strong> e ainda{" "}
                    <strong>não recebeu o email</strong>, podemos{" "}
                    <Link
                        onClick={async () => {
                            const recoveryToken = (
                                await recoveryAccount.post(formState)
                            ).data?.output;

                            if (recoveryToken) {
                                setFormState({ ...formState, recoveryToken });
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
                        enviar um novo código
                    </Link>
                    .
                </Typography>
            </Box>
            <form
                style={{
                    display: "flex",
                    flexDirection: "column",
                }}
                onSubmit={async (event) => {
                    event.preventDefault();
                    const response = (await submitForm()).data;

                    if (response.errors.length > 0) {
                        return;
                    }

                    setFormState({ ...formState, code: form.code.value });
                    setStep(2);
                }}
            >
                <Box marginBottom={1}>
                    <TextField
                        label="Código de recuperação"
                        variant="outlined"
                        fullWidth
                        value={form.code.value}
                        disabled={loading}
                        helperText={form.code.touched && form.code.errors[0]}
                        onFocus={() => setFormFocus("code")}
                        onBlur={() => setFormBlur("code")}
                        error={form.code.touched && form.code.errors.length > 0}
                        onChange={(event) =>
                            setForm({
                                code: event.target.value,
                            })
                        }
                    />
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? <CircularProgress /> : "Enviar código"}
                </Button>
            </form>
        </>
    );
}
