import createAccount from "@api/create-account";
import { CreateAccountProps } from "./index";
import PhoneVerification from "../phone-verification";

export default function PhoneVerificationStep({
    setStep,
    formProps: { form, data },
    firebaseAuthProps,
}: CreateAccountProps) {
    return (
        <PhoneVerification
            user={data}
            firebaseAuthProps={firebaseAuthProps}
            finishButtonText="Finalizar"
            requestUser={async (user) =>
                (await createAccount.post(user)).data?.output
            }
            onFinish={async (user) => {
                setStep(2);
            }}
        />
    );
}
