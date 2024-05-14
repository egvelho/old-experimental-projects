import endpoint from "@app/http/endpoint";
import validate from "@app/http/middleware/validate";
import User from "@app/user/user.entity";

export default endpoint(__filename, {
    post: validate({
        async method() {
            return undefined;
        },
        inputType: User,
        groups: ["update-phone-number"],
    }),
});
