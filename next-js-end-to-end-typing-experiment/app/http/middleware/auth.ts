import { getRepository } from "typeorm";
import User from "@app/user/user.entity";
import typeson from "../typeson";
import { Method } from "../types";
import AuthToken from "../auth-token";

export type HasPermission<Input> =
    | ((input: Input, user: User | undefined) => Promise<boolean>)
    | User["role"];

export default function auth<Input, Output>(
    hasPermission: HasPermission<Input>,
    method: Method<[Input, User], Output>,
): Method<Input, Output | undefined> {
    return async (input, req, res) => {
        const token = AuthToken.extractTokenFromHeader(req);

        if (token !== undefined) {
            const decodedToken = await AuthToken.decodeToken(token);

            if (decodedToken !== undefined) {
                const users = getRepository(User);
                const user = await users.findOne({
                    uid: decodedToken.uid,
                });

                if (
                    ((typeof hasPermission === "function" &&
                        (await hasPermission(input, user))) ||
                        hasPermission === user?.role ||
                        user?.role === "admin") &&
                    user
                ) {
                    return method([input, user], req, res);
                }
            }
        }

        const response = typeson.encapsulate(undefined);

        res.status(401).json(response);

        return undefined;
    };
}
