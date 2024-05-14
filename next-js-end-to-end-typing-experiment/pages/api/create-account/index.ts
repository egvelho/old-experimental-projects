import { getRepository } from "typeorm";
import AuthToken from "@app/http/auth-token";
import endpoint from "@app/http/endpoint";
import validate from "@app/http/middleware/validate";
import User from "@app/user/user.entity";

export default endpoint(__filename, {
    post: validate({
        async method(user: User, req) {
            const token = AuthToken.extractTokenFromHeader(req);
            const decodedToken = await AuthToken.decodeToken(token);

            if (
                decodedToken !== undefined &&
                user.phoneNumber?.replace(/\D+/g, "") ===
                    (decodedToken.phone_number as string).replace("+55", "")
            ) {
                user.role = "customer";
                user.uid = decodedToken.uid;

                return getRepository(User).save(user);
            }

            return undefined;
        },
        inputType: User,
        groups: ["create-account", "myself"],
    }),
});
