import memoize from "lodash.memoize";
import getConfig from "next/config";

function entry<T>(
    type_: "string" | "boolean" | "number",
    name: string,
    value: string | undefined,
    default_?: T,
): T {
    const value_: any = value
        ? value.replace(/(\r\n|\n|\r)/gm, "")
        : default_ ?? undefined;

    if (!value && !default_ && typeof window === "undefined") {
        throw new Error(`Entry value for "${name}" was not found in env.`);
    }

    switch (type_) {
        case "boolean":
            return Boolean(value_) as any;
        case "number":
            return parseInt(value_) as any;
        case "string":
            return (value_ ?? "").toString().replace(/\\n/g, "\n") as any;
        default:
            return value_;
    }
}

function config() {
    const {
        publicRuntimeConfig: {
            NODE_ENV,
            PAGINATION,
            FIREBASE_API_KEY,
            FIREBASE_AUTH_DOMAIN,
            FIREBASE_DATABASE_URL,
            FIREBASE_PROJECT_ID,
            FIREBASE_STORAGE_BUCKET,
            FIREBASE_MESSAGING_SENDER_ID,
            FIREBASE_APP_ID,
            FIREBASE_MEASUREMENT_ID,
            FIREBASE_PUBLIC_VAPID_KEY,
        },
        serverRuntimeConfig: {
            MAIL_HOST,
            MAIL_USER,
            MAIL_PASSWORD,
            FIREBASE_TYPE,
            FIREBASE_PRIVATE_KEY_ID,
            FIREBASE_PRIVATE_KEY,
            FIREBASE_CLIENT_EMAIL,
            FIREBASE_CLIENT_ID,
            FIREBASE_AUTH_URI,
            FIREBASE_TOKEN_URI,
            FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
            FIREBASE_CLIENT_X509_CERT_URL,
            PORT,
            JWT_SECRET,
        },
    } = getConfig();

    return {
        pagination: entry<number>("number", "PAGINATION", PAGINATION, 30),
        port: entry<number>("number", "PORT", PORT, 3000),
        jwtSecret: entry<string>("string", "JWT_SECRET", JWT_SECRET),
        nodeEnv: entry<string>("string", "NODE_ENV", NODE_ENV, "development"),
        mail: {
            host: entry<string>("string", "MAIL_HOST", MAIL_HOST),
            user: entry<string>("string", "MAIL_USER", MAIL_USER),
            password: entry<string>("string", "MAIL_PASSWORD", MAIL_PASSWORD),
        },
        firebase: {
            apiKey: entry<string>(
                "string",
                "FIREBASE_API_KEY",
                FIREBASE_API_KEY,
            ),
            authDomain: entry<string>(
                "string",
                "FIREBASE_AUTH_DOMAIN",
                FIREBASE_AUTH_DOMAIN,
            ),
            databaseURL: entry<string>(
                "string",
                "FIREBASE_DATABASE_URL",
                FIREBASE_DATABASE_URL,
            ),
            projectId: entry<string>(
                "string",
                "FIREBASE_PROJECT_ID",
                FIREBASE_PROJECT_ID,
            ),
            storageBucket: entry<string>(
                "string",
                "FIREBASE_STORAGE_BUCKET",
                FIREBASE_STORAGE_BUCKET,
            ),
            messagingSenderId: entry<string>(
                "string",
                "FIREBASE_MESSAGING_SENDER_ID",
                FIREBASE_MESSAGING_SENDER_ID,
            ),
            appId: entry<string>("string", "FIREBASE_APP_ID", FIREBASE_APP_ID),
            measurementId: entry<string>(
                "string",
                "FIREBASE_MEASUREMENT_ID",
                FIREBASE_MEASUREMENT_ID,
            ),
            publicVapidKey: entry<string>(
                "string",
                "FIREBASE_PUBLIC_VAPID_KEY",
                FIREBASE_PUBLIC_VAPID_KEY,
            ),
            type: entry<string>("string", "FIREBASE_TYPE", FIREBASE_TYPE),
            privateKeyId: entry<string>(
                "string",
                "FIREBASE_PRIVATE_KEY_ID",
                FIREBASE_PRIVATE_KEY_ID,
            ),
            privateKey: entry<string>(
                "string",
                "FIREBASE_PRIVATE_KEY",
                FIREBASE_PRIVATE_KEY,
            ),
            clientEmail: entry<string>(
                "string",
                "FIREBASE_CLIENT_EMAIL",
                FIREBASE_CLIENT_EMAIL,
            ),
            clientId: entry<string>(
                "string",
                "FIREBASE_CLIENT_ID",
                FIREBASE_CLIENT_ID,
            ),
            authUri: entry<string>(
                "string",
                "FIREBASE_AUTH_URI",
                FIREBASE_AUTH_URI,
            ),
            tokenUri: entry<string>(
                "string",
                "FIREBASE_TOKEN_URI",
                FIREBASE_TOKEN_URI,
            ),
            authProviderX509CertUrl: entry<string>(
                "string",
                "FIREBASE_AUTH_PROVIDER_X509_CERT_URL",
                FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
            ),
            clientX509CertUrl: entry<string>(
                "string",
                "FIREBASE_CLIENT_X509_CERT_URL",
                FIREBASE_CLIENT_X509_CERT_URL,
            ),
        },
    };
}

export default memoize(config);
