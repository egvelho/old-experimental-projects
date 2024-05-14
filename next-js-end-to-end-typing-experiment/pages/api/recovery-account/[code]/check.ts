import { IsString } from "class-validator";
import endpoint from "@app/http/endpoint";
import validate from "@app/http/middleware/validate";
import { MatchesJWT } from "@app/validators";
import { RecoveryCodePayload } from "../index";

export class Code {
    @MatchesJWT(
        "recoveryToken",
        (payload: RecoveryCodePayload) => payload.code,
        {
            message:
                "O código foi digitado incorretamente. Por favor, tente novamente.",
        },
    )
    @IsString()
    code!: string;

    @IsString()
    recoveryToken!: string;
}

export default endpoint(__filename, {
    post: validate({
        async method() {
            return undefined;
        },
        inputType: Code,
    }),
});
