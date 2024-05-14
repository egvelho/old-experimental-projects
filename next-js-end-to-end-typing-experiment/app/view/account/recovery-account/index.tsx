import { useState } from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { UserWithCode } from "@api/recovery-account/[code]/index";
import { useFirebaseAuth, UseFirebaseAuth } from "@app/firebase";
import EmailCodeStep from "./email-code-step";
import VerifyCodeStep from "./verify-code-step";
import UpdatePhoneStep from "./update-phone-step";
import PhoneVerificationStep from "./phone-verification-step";
import EndStep from "./end-step";
import { AccountViewProps } from "../index";

type Step = 0 | 1 | 2 | 3 | 4;

export interface RecoveryAccountProps {
    step: Step;
    setStep: (step: Step) => void;
    formState: UserWithCode;
    setFormState: (form: UserWithCode) => void;
    firebaseAuthProps: UseFirebaseAuth;
}

export default function RecoveryAccount({ setView }: AccountViewProps) {
    const [formState, setFormState] = useState({
        phoneNumber: "",
        recoveryToken: "",
        code: "",
        email: "",
    } as UserWithCode);
    const [step, setStep] = useState(0 as Step);
    const firebaseAuthProps = useFirebaseAuth();

    return (
        <>
            <DialogTitle style={{ textAlign: "center" }}>
                Vamos recuperar a sua conta!
            </DialogTitle>
            <DialogContent>
                <Box marginBottom={2} marginX={2} textAlign="center">
                    <Typography>
                        Caso você tenha{" "}
                        <strong>perdido acesso ao seu celular</strong> e não
                        consiga mais entrar na sua conta, siga os passos abaixo.
                        Vamos orientá-lo para que você consiga{" "}
                        <strong>cadastrar um novo celular</strong>.
                    </Typography>
                </Box>
                <Stepper activeStep={step} orientation="vertical">
                    <Step>
                        <StepLabel>Enviar email de recuperação</StepLabel>
                        <StepContent>
                            <EmailCodeStep
                                step={step}
                                setStep={(step) => setStep(step)}
                                firebaseAuthProps={firebaseAuthProps}
                                formState={formState}
                                setFormState={(form: UserWithCode) =>
                                    setFormState(form)
                                }
                            />
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel>Verificar código</StepLabel>
                        <StepContent>
                            <VerifyCodeStep
                                step={step}
                                setStep={(step) => setStep(step)}
                                firebaseAuthProps={firebaseAuthProps}
                                formState={formState}
                                setFormState={(form: UserWithCode) =>
                                    setFormState(form)
                                }
                            />
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel>Atualizar celular</StepLabel>
                        <StepContent>
                            <UpdatePhoneStep
                                step={step}
                                setStep={(step) => setStep(step)}
                                firebaseAuthProps={firebaseAuthProps}
                                formState={formState}
                                setFormState={(form: UserWithCode) =>
                                    setFormState(form)
                                }
                            />
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel>Verificar celular</StepLabel>
                        <StepContent>
                            <PhoneVerificationStep
                                step={step}
                                setStep={(step) => setStep(step)}
                                firebaseAuthProps={firebaseAuthProps}
                                formState={formState}
                                setFormState={(form: UserWithCode) =>
                                    setFormState(form)
                                }
                            />
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel>Finalizar</StepLabel>
                        <StepContent>
                            <EndStep
                                step={step}
                                setStep={(step) => setStep(step)}
                                firebaseAuthProps={firebaseAuthProps}
                                formState={formState}
                                setFormState={(form: UserWithCode) =>
                                    setFormState(form)
                                }
                            />
                        </StepContent>
                    </Step>
                </Stepper>
            </DialogContent>
        </>
    );
}
