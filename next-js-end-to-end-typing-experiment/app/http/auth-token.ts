import { NextApiRequest } from "next";
import { auth } from "firebase-admin";

export default class AuthToken {
    static async isValid(token?: string): Promise<boolean> {
        if (!token) {
            return false;
        }

        try {
            const decodedToken = await auth().verifyIdToken(token);
            return true;
        } catch {
            return false;
        }
    }

    static async decodeToken(
        token?: string,
    ): Promise<auth.DecodedIdToken | undefined> {
        if (!token) {
            return undefined;
        }

        try {
            const decodedToken = await auth().verifyIdToken(token);
            return decodedToken;
        } catch {
            return undefined;
        }
    }

    static extractTokenFromHeader(req: NextApiRequest): string | undefined {
        if (req.headers.authorization?.startsWith("Bearer ")) {
            const token = req.headers.authorization.substring(
                7,
                req.headers.authorization.length,
            );

            return token;
        }

        return undefined;
    }
}
