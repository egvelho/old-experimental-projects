import { SelectQueryBuilder } from "typeorm";
import User from "@app/user/user.entity";
import { Method } from "../types";
import auth, { HasPermission } from "./auth";
import paginate, { Pagination } from "./paginate";

export default function authPaginate<Input, Output>(
    hasPermission: HasPermission<Input>,
    method: Method<[Input, User], SelectQueryBuilder<Output>>,
): Method<Pagination<Input>, [Output[], number] | undefined> {
    return ({ input, take, skip }, req, res) =>
        auth(hasPermission, (input, req, res) =>
            paginate(method)({ input, take, skip }, req, res),
        )(input, req, res);
}
