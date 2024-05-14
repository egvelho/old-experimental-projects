import submitCode from "@api/recovery-account/[code]";
import { UserWithCode } from "@api/recovery-account/[code]/index";
import { RecoveryAccountProps } from "./index";
import PhoneVerification from "../phone-verification";

export default function PhoneVerificationStep({
    setStep,
    formState,
    firebaseAuthProps,
}: RecoveryAccountProps) {
    return (
        <PhoneVerification
            user={formState}
            firebaseAuthProps={firebaseAuthProps}
            finishButtonText="Finalizar"
            requestUser={async (user) =>
                (await submitCode.post(user as UserWithCode)).data?.output
            }
            onFinish={async (user) => {
                setStep(4);
            }}
        />
    );
}
