import User from "@app/user/user.entity";
import { Method, MaybeOutput } from "../types";
import auth, { HasPermission } from "./auth";
import validate, { Validation } from "./validate";

export interface AuthValidation<Input, Output>
    extends Omit<Validation<Input, Output>, "method"> {
    hasPermission: HasPermission<Input>;
    method: Method<[Input, User], Output>;
}

export default function authValidate<Input, Output>({
    inputType,
    method,
    groups,
    hasPermission,
}: AuthValidation<Input, Output>): Method<
    Input,
    MaybeOutput<Output> | undefined
> {
    return auth(hasPermission, ([input, user], req, res) =>
        validate({
            inputType,
            method: (input, req, res) => method([input, user], req, res),
            groups,
        })(input, req, res),
    );
}
