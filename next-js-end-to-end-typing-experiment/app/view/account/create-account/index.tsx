import { useState } from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Box from "@material-ui/core/Box";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import StepLabel from "@material-ui/core/StepLabel";
import Typography from "@material-ui/core/Typography";
import checkValuesCreateAccount from "@api/create-account/check-values";
import { MaybeOutput } from "@app/http/types";
import { useFirebaseAuth, UseFirebaseAuth } from "@app/firebase";
import useForm, { UseForm } from "@app/http/use-form";
import User from "@app/user/user.entity";
import { AccountViewProps } from "../index";
import PersonalDataStep from "./personal-data-step";
import PhoneVerificationStep from "./phone-verification-step";
import EndStep from "./end-step";

type Step = 0 | 1 | 2;

export interface CreateAccountProps {
    step: Step;
    setStep: (step: Step) => void;
    formProps: UseForm<User, MaybeOutput<User> | MaybeOutput<undefined>>;
    firebaseAuthProps: UseFirebaseAuth;
}

function SwitchSteps(props: CreateAccountProps) {
    switch (props.step) {
        case 0:
            return <PersonalDataStep {...props} />;
        case 1:
            return <PhoneVerificationStep {...props} />;
        case 2:
            return <EndStep {...props} />;
    }
}

export default function CreateAccount({ setView }: AccountViewProps) {
    const [step, setStep] = useState(0 as Step);
    const firebaseAuthProps = useFirebaseAuth();
    const formProps = useForm(
        checkValuesCreateAccount.enforceInput.post(User),
        {
            name: "",
            surname: "",
            phoneNumber: "",
            email: "",
            cpf: "",
        },
    );

    return (
        <>
            {step < 2 && (
                <DialogTitle style={{ textAlign: "center" }}>
                    Criar a sua conta
                </DialogTitle>
            )}
            <DialogContent>
                {step < 2 && (
                    <>
                        <Box marginBottom={2} marginX={2} textAlign="center">
                            <Typography>
                                Por favor, siga os passos abaixo. Não leva nem 5
                                minutos, a gente promete! 😉
                            </Typography>
                        </Box>
                        <Stepper
                            activeStep={step}
                            alternativeLabel
                            style={{
                                paddingRight: 0,
                                paddingLeft: 0,
                            }}
                        >
                            <Step>
                                <StepButton onClick={() => setStep(0)}>
                                    Cadastrar dados
                                </StepButton>
                            </Step>
                            <Step>
                                <StepLabel>Verificar celular</StepLabel>
                            </Step>
                            <Step>
                                <StepLabel>Finalizar</StepLabel>
                            </Step>
                        </Stepper>
                    </>
                )}
                <Box>
                    <SwitchSteps
                        step={step}
                        setStep={(step) => setStep(step)}
                        formProps={formProps}
                        firebaseAuthProps={firebaseAuthProps}
                    />
                </Box>
            </DialogContent>
        </>
    );
}
