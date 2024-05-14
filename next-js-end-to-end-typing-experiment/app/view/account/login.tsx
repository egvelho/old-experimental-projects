import { useState } from "react";
import InputMask from "react-input-mask";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { MaybeOutput } from "@app/http/types";
import User from "@app/user/user.entity";
import { useFirebaseAuth, UseFirebaseAuth } from "@app/firebase";
import { useContext } from "@app/context";
import useForm, { UseForm } from "@app/http/use-form";
import myself from "@api/myself";
import userExists from "@api/users/exists";
import PhoneVerificationStep from "./phone-verification";
import { AccountViewProps } from "./index";

type Step = "login" | "phone-verification";

interface StepProps {
    step: Step;
    setStep: (step: Step) => void;
}

interface LoginStepProps extends AccountViewProps, StepProps {
    firebaseAuthProps: UseFirebaseAuth;
    formProps: UseForm<User, MaybeOutput<User> | MaybeOutput<undefined>>;
}

function LoginStep({
    firebaseAuthProps,
    formProps,
    setView,
    setStep,
}: LoginStepProps) {
    const [, setContext] = useContext();

    return (
        <>
            <form
                onSubmit={async (event) => {
                    event.preventDefault();
                    const { errors } = (await formProps.submitForm()).data;

                    if (errors.length > 0) {
                        return;
                    }

                    const success =
                        formProps.form.phoneNumber?.value !== undefined &&
                        (await firebaseAuthProps.requestCode(
                            formProps.form.phoneNumber.value,
                        ));

                    success && setStep("phone-verification");
                    !success &&
                        setContext({
                            snackbar: [
                                "Houve um erro de conexão. Por favor, tente novamente.",
                                "error",
                            ],
                        });
                }}
                style={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box marginBottom={1}>
                    <InputMask
                        mask="(99) 99999-9999"
                        value={formProps.form.phoneNumber?.value}
                        disabled={
                            formProps.loading || firebaseAuthProps.loading
                        }
                        maskChar=" "
                        onFocus={() => formProps.setFormFocus("phoneNumber")}
                        onBlur={() => formProps.setFormBlur("phoneNumber")}
                        onChange={(event) =>
                            formProps.setForm({
                                phoneNumber: event.target.value,
                            })
                        }
                    >
                        {() => (
                            <TextField
                                label="Celular"
                                variant="outlined"
                                fullWidth
                                disabled={
                                    formProps.loading ||
                                    firebaseAuthProps.loading
                                }
                                error={
                                    formProps.form.phoneNumber?.touched &&
                                    formProps.form.phoneNumber?.errors.length >
                                        0
                                }
                                helperText={
                                    formProps.form.phoneNumber?.touched &&
                                    formProps.form.phoneNumber?.errors[0]
                                }
                            />
                        )}
                    </InputMask>
                </Box>
                <Button
                    variant="outlined"
                    color="primary"
                    type="submit"
                    disabled={formProps.loading || firebaseAuthProps.loading}
                >
                    {firebaseAuthProps.loading || formProps.loading ? (
                        <CircularProgress />
                    ) : (
                        "Entrar"
                    )}
                </Button>
            </form>
            <Box marginY={2}>
                <Typography>
                    Problemas para entrar?{" "}
                    <Link
                        onClick={() => setView("recovery-account")}
                        style={{ cursor: "pointer" }}
                    >
                        Recupere a sua conta
                    </Link>
                    .
                </Typography>
            </Box>
            <Button
                variant="contained"
                color="primary"
                onClick={() => setView("create-account")}
            >
                Criar conta
            </Button>
        </>
    );
}

export default function Login({ view, setView }: AccountViewProps) {
    const [step, setStep] = useState("login" as Step);
    const formProps = useForm(userExists.enforceInput.post(User), {
        phoneNumber: "",
    });
    const firebaseAuthProps = useFirebaseAuth();

    return (
        <>
            {step === "phone-verification" && (
                <DialogContent>
                    <IconButton
                        onClick={() => setStep("login")}
                        edge="start"
                        color="inherit"
                        aria-label="Voltar"
                    >
                        <ArrowBackIcon fontSize="large" />
                    </IconButton>
                </DialogContent>
            )}
            <DialogTitle style={{ textAlign: "center" }}>
                Entrar na sua conta
            </DialogTitle>
            <DialogContent
                style={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {step === "login" ? (
                    <LoginStep
                        formProps={formProps}
                        firebaseAuthProps={firebaseAuthProps}
                        setStep={(step) => setStep(step)}
                        step={step}
                        view={view}
                        setView={setView}
                    />
                ) : (
                    <PhoneVerificationStep
                        user={formProps.data}
                        firebaseAuthProps={firebaseAuthProps}
                        requestUser={async (user) =>
                            (await myself.get({})).data
                        }
                        onFinish={async (user) => {
                            setView(undefined);
                        }}
                    />
                )}
            </DialogContent>
        </>
    );
}
