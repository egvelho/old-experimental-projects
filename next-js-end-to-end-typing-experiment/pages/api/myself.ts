import endpoint from "@app/http/endpoint";
import auth from "@app/http/middleware/auth";

export default endpoint(__filename, {
    get: auth("customer", async ([, user]) => {
        return user;
    }),
});
