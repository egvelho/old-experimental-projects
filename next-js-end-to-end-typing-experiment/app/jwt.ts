import jwt, { VerifyOptions, SignOptions } from "jsonwebtoken";
import config from "@app/config";

export default class JWT {
    static encode<Payload extends Object | string>(
        payload: Payload,
        options?: SignOptions,
    ) {
        try {
            const token = jwt.sign(payload, config().jwtSecret, options);
            return token;
        } catch {
            return undefined;
        }
    }

    static decode<Payload extends Object | string>(
        token: string,
        options?: VerifyOptions,
    ) {
        try {
            const decodedToken = jwt.verify(
                token,
                config().jwtSecret,
                options,
            ) as Payload;
            return decodedToken;
        } catch {
            return undefined;
        }
    }
}
