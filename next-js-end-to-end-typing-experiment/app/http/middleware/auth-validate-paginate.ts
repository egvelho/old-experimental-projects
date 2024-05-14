import { SelectQueryBuilder } from "typeorm";
import User from "@app/user/user.entity";
import { Method, MaybeOutput } from "../types";
import auth, { HasPermission } from "./auth";
import validate, { Validation } from "./validate";
import paginate, { Pagination } from "./paginate";

export interface AuthValidationPagination<Input, Output>
    extends Omit<Validation<Input, Output>, "method"> {
    hasPermission: HasPermission<Input>;
    method: Method<[Input, User], SelectQueryBuilder<Output>>;
}

export default function authValidatePaginate<Input, Output>({
    inputType,
    method,
    groups,
    hasPermission,
}: AuthValidationPagination<Input, Output>): Method<
    Pagination<Input>,
    MaybeOutput<[Output[], number]> | undefined
> {
    return ({ input, take, skip }, req, res) =>
        auth(hasPermission, ([input, user], req, res) =>
            validate({
                inputType,
                method: (input, req, res) =>
                    paginate<Input, Output>((input, req, res) =>
                        method([input, user], req, res),
                    )({ input, take, skip }, req, res),
                groups,
            })(input, req, res),
        )(input, req, res);
}
