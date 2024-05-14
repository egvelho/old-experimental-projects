import { getRepository } from "typeorm";
import { IsString } from "class-validator";
import endpoint from "@app/http/endpoint";
import validate from "@app/http/middleware/validate";
import User from "@app/user/user.entity";
import JWT from "@app/jwt";
import { MatchesJWT } from "@app/validators";
import { VerifyCodePayload } from "./index";

export class Code {
    @MatchesJWT("verifyToken", (payload: VerifyCodePayload) => payload.code, {
        message:
            "O código foi digitado incorretamente. Por favor, tente novamente.",
    })
    @IsString()
    code!: string;

    @IsString()
    verifyToken!: string;
}

export default endpoint(__filename, {
    post: validate({
        async method({ verifyToken }) {
            const { email } = <VerifyCodePayload>JWT.decode(verifyToken);
            const users = await getRepository(User);
            const updateResults = users.update(
                { email: email },
                { emailVerified: true },
            );

            return updateResults && (await users.findOne({ email }));
        },
        inputType: Code,
        groups: ["myself"],
    }),
});
