import { SelectQueryBuilder } from "typeorm";
import { Method, MaybeOutput } from "../types";
import validate, { Validation } from "./validate";
import paginate, { Pagination } from "./paginate";

export interface ValidationPagination<Input, Output>
    extends Omit<Validation<Input, Output>, "method"> {
    method: Method<Input, SelectQueryBuilder<Output>>;
}

export default function validatePaginate<Input, Output>({
    inputType,
    method,
    groups,
}: ValidationPagination<Input, Output>): Method<
    Pagination<Input>,
    MaybeOutput<[Output[], number]>
> {
    return ({ input, take, skip }, req, res) =>
        validate({
            inputType,
            method: (input, req, res) =>
                paginate(method)({ input, take, skip }, req, res),
            groups,
        })(input, req, res);
}
