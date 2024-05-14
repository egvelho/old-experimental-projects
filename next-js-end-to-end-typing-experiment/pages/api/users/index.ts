import { getRepository } from "typeorm";
import endpoint from "@app/http/endpoint";
import authValidatePaginate from "@app/http/middleware/auth-validate-paginate";
import User from "@app/user/user.entity";

export default endpoint(__filename, {
    get: authValidatePaginate({
        inputType: Object,
        groups: ["admin"],
        hasPermission: "admin",
        async method() {
            return getRepository(User).createQueryBuilder();
        },
    }),
});
