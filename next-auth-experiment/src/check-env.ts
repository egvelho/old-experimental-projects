import { envEntry } from "@egvelho/next-utils";

export default function env() {
  return {
    nodeEnv: envEntry<"development" | "production">(
      "string",
      "NODE_ENV",
      process.env.NODE_ENV,
    ),
    jwtSecret: envEntry<string>("string", "JWT_SECRET", process.env.JWT_SECRET),
    mailHost: envEntry<string>("string", "MAIL_HOST", process.env.MAIL_HOST),
    mailUser: envEntry<string>("string", "MAIL_USER", process.env.MAIL_USER),
    mailSecure: envEntry<boolean>(
      "boolean",
      "MAIL_SECURE",
      process.env.MAIL_SECURE,
    ),
    mailRequireTLS: envEntry<boolean>(
      "boolean",
      "MAIL_REQUIRE_TLS",
      process.env.MAIL_REQUIRE_TLS,
    ),
    mailPassword: envEntry<string>(
      "string",
      "MAIL_PASSWORD",
      process.env.MAIL_PASSWORD,
    ),
    databaseUrl: envEntry<string>(
      "string",
      "DATABASE_URL",
      process.env.DATABASE_URL,
    ),
    firebase: {
      apiKey: envEntry<string>(
        "string",
        "NEXT_PUBLIC_FIREBASE_API_KEY",
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      ),
      authDomain: envEntry<string>(
        "string",
        "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      ),
      databaseURL: envEntry<string>(
        "string",
        "NEXT_PUBLIC_FIREBASE_DATABASE_URL",
        process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      ),
      projectId: envEntry<string>(
        "string",
        "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      ),
      storageBucket: envEntry<string>(
        "string",
        "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
        process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      ),
      messagingSenderId: envEntry<string>(
        "string",
        "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
        process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      ),
      appId: envEntry<string>(
        "string",
        "NEXT_PUBLIC_FIREBASE_APP_ID",
        process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      ),
      measurementId: envEntry<string>(
        "string",
        "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID",
        process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      ),
      publicVapidKey: envEntry<string>(
        "string",
        "NEXT_PUBLIC_FIREBASE_PUBLIC_VAPID_KEY",
        process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_VAPID_KEY,
      ),
      type: envEntry<string>(
        "string",
        "FIREBASE_TYPE",
        process.env.FIREBASE_TYPE,
      ),
      privateKeyId: envEntry<string>(
        "string",
        "FIREBASE_PRIVATE_KEY_ID",
        process.env.FIREBASE_PRIVATE_KEY_ID,
      ),
      privateKey: envEntry<string>(
        "string",
        "FIREBASE_PRIVATE_KEY",
        process.env.FIREBASE_PRIVATE_KEY,
      ),
      clientEmail: envEntry<string>(
        "string",
        "FIREBASE_CLIENT_EMAIL",
        process.env.FIREBASE_CLIENT_EMAIL,
      ),
      clientId: envEntry<string>(
        "string",
        "FIREBASE_CLIENT_ID",
        process.env.FIREBASE_CLIENT_ID,
      ),
      authUri: envEntry<string>(
        "string",
        "FIREBASE_AUTH_URI",
        process.env.FIREBASE_AUTH_URI,
      ),
      tokenUri: envEntry<string>(
        "string",
        "FIREBASE_TOKEN_URI",
        process.env.FIREBASE_TOKEN_URI,
      ),
      authProviderX509CertUrl: envEntry<string>(
        "string",
        "FIREBASE_AUTH_PROVIDER_X509_CERT_URL",
        process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      ),
      clientX509CertUrl: envEntry<string>(
        "string",
        "FIREBASE_CLIENT_X509_CERT_URL",
        process.env.FIREBASE_CLIENT_X509_CERT_URL,
      ),
    },
  };
}
