import { SelectQueryBuilder } from "typeorm";
import appConfig from "@app/config";
import { Method } from "../types";

export interface Pagination<Input> {
    input: Input;
    take?: number;
    skip?: number;
}

export default function paginate<Input, Output>(
    method: Method<Input, SelectQueryBuilder<Output>>,
): Method<Pagination<Input>, [Output[], number]> {
    return async (
        { input, take = appConfig().pagination, skip = 0 },
        req,
        res,
    ) =>
        (await method(input, req, res)).take(take).skip(skip).getManyAndCount();
}
