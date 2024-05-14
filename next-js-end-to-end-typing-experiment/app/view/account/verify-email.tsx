import { useEffect, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import User from "@app/user/user.entity";
import useForm from "@app/http/use-form";
import { useContext } from "@app/context";
import verifyEmail from "@api/verify-email";
import verifyCode, { Code } from "@api/verify-email/[code]";

export interface VerifyEmailProps {
    email: string | undefined;
    setEmail: (email: string | undefined) => void;
}

type Step = "email-code" | "verify-code";

interface StepProps extends VerifyEmailProps {
    step: Step;
    setStep: (step: Step) => void;
    verifyToken: string;
    setVerifyToken: (verifyToken: string) => void;
}

function EmailCode({ setStep, email, setEmail, setVerifyToken }: StepProps) {
    const [, setContext] = useContext();
    const { loading, submitForm } = useForm(
        verifyEmail.enforceInput.post(User),
        {
            email,
        },
    );

    return (
        <>
            <DialogContent>
                <Typography>
                    O email <strong>{email}</strong> ainda não foi verificado.
                    Utilizamos o seu email para{" "}
                    <strong>enviar notificações</strong> e também para{" "}
                    <strong>recuperar a sua conta</strong> caso você tenha
                    perdido acesso ao seu celular.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setEmail(undefined)}
                >
                    Fechar
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    autoFocus
                    disabled={loading}
                    onClick={async () => {
                        const { output, errors } = (await submitForm()).data;

                        if (errors.length > 0) {
                            setContext({
                                snackbar: [
                                    Object.keys(errors[0].constraints)[0],
                                    "error",
                                ],
                            });

                            return;
                        }

                        if (output !== undefined) {
                            setVerifyToken(output);
                            setStep("verify-code");
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
                    {loading ? <CircularProgress /> : "Verificar"}
                </Button>
            </DialogActions>
        </>
    );
}

function VerifyCode({ email, verifyToken }: StepProps) {
    const [, setContext] = useContext();

    const {
        form,
        loading,
        submitForm,
        setForm,
        setFormFocus,
        setFormBlur,
    } = useForm(verifyCode.enforceInput.post(Code), {
        code: "",
        verifyToken,
    });

    return (
        <>
            <DialogContent>
                <Box marginBottom={1}>
                    <Typography>
                        Insira o código de verificação enviado para{" "}
                        <strong>{email}</strong>. Caso você não encontre este
                        email na sua <strong>caixa de entrada</strong>, por
                        favor, verifique a <strong>lixeira</strong> ou a{" "}
                        <strong>caixa de spam</strong>. Se você esperou mais de{" "}
                        <strong>5 minutos</strong> e ainda{" "}
                        <strong>não recebeu o email</strong>, podemos{" "}
                        <Link onClick={async () => {}}>
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

                        const { errors } = (await submitForm()).data;

                        if (errors.length > 0) {
                            return;
                        }

                        setContext({
                            verifyEmail: undefined,
                            snackbar: [
                                "Email verificado com sucesso.",
                                "success",
                            ],
                        });
                    }}
                >
                    <Box marginBottom={1}>
                        <TextField
                            label="Código de verificação"
                            variant="outlined"
                            fullWidth
                            value={form.code.value}
                            disabled={loading}
                            helperText={
                                form.code.touched && form.code.errors[0]
                            }
                            onFocus={() => setFormFocus("code")}
                            onBlur={() => setFormBlur("code")}
                            error={
                                form.code.touched && form.code.errors.length > 0
                            }
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
            </DialogContent>
        </>
    );
}

export default function VerifyEmail({ email, setEmail }: VerifyEmailProps) {
    const [step, setStep] = useState("email-code" as Step);
    const [verifyToken, setVerifyToken] = useState("");

    useEffect(() => {
        setStep("email-code");
        setVerifyToken("");
    }, [email]);

    return (
        <Dialog
            open={email !== undefined}
            onClose={() => setEmail(undefined)}
            scroll="body"
        >
            <DialogTitle style={{ textAlign: "center" }}>
                Verificar seu email
            </DialogTitle>
            {step === "email-code" ? (
                <EmailCode
                    email={email}
                    setEmail={(email) => setEmail(email)}
                    step={step}
                    setStep={(step) => setStep(step)}
                    verifyToken={verifyToken}
                    setVerifyToken={(verifyToken) =>
                        setVerifyToken(verifyToken)
                    }
                />
            ) : (
                <VerifyCode
                    email={email}
                    setEmail={(email) => setEmail(email)}
                    step={step}
                    setStep={(step) => setStep(step)}
                    verifyToken={verifyToken}
                    setVerifyToken={(verifyToken) =>
                        setVerifyToken(verifyToken)
                    }
                />
            )}
        </Dialog>
    );
}
