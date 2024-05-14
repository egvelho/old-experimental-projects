import { getRepository } from "typeorm";
import { IsString } from "class-validator";
import AuthToken from "@app/http/auth-token";
import endpoint from "@app/http/endpoint";
import validate from "@app/http/middleware/validate";
import User from "@app/user/user.entity";
import JWT from "@app/jwt";
import { MatchesJWT } from "@app/validators";
import { RecoveryCodePayload } from "../index";

export class UserWithCode extends User {
    @IsString({
        groups: ["recovery-account"],
    })
    @MatchesJWT(
        "recoveryToken",
        (payload: RecoveryCodePayload) => payload.code,
        {
            groups: ["recovery-account"],
            message:
                "O código foi digitado incorretamente. Por favor, tente novamente.",
        },
    )
    code!: string;

    @IsString({
        groups: ["recovery-account"],
    })
    recoveryToken!: string;
}

export default endpoint(__filename, {
    post: validate({
        async method({ phoneNumber, recoveryToken }: UserWithCode, req) {
            const authToken = AuthToken.extractTokenFromHeader(req);
            const decodedAuthToken = await AuthToken.decodeToken(authToken);
            const recoveryCodePayload = <RecoveryCodePayload>(
                JWT.decode(recoveryToken)
            );

            if (
                decodedAuthToken !== undefined &&
                phoneNumber?.replace(/\D+/g, "") ===
                    (decodedAuthToken.phone_number as string).replace("+55", "")
            ) {
                const users = await getRepository(User);
                const updateResults = users.update(
                    {
                        email: recoveryCodePayload.email,
                        uid: decodedAuthToken.uid,
                    },
                    { phoneNumber },
                );

                return updateResults && (await users.findOne({ phoneNumber }));
            }

            return undefined;
        },
        inputType: UserWithCode,
        groups: ["recovery-account", "update-phone-number", "myself"],
    }),
});
