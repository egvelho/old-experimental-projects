require("dotenv").config();

const path = require("path");
const withCSS = require("@zeit/next-css");
const withLess = require("@zeit/next-less");
const withImages = require("next-images");
const withFonts = require("next-fonts");
const nextRuntimeDotenv = require("next-runtime-dotenv");

const withConfig = nextRuntimeDotenv({
    public: [
        "FIREBASE_API_KEY",
        "FIREBASE_AUTH_DOMAIN",
        "FIREBASE_DATABASE_URL",
        "FIREBASE_PROJECT_ID",
        "FIREBASE_STORAGE_BUCKET",
        "FIREBASE_MESSAGING_SENDER_ID",
        "FIREBASE_APP_ID",
        "FIREBASE_MEASUREMENT_ID",
        "FIREBASE_PUBLIC_VAPID_KEY",
        "PAGINATION",
        "NODE_ENV",
    ],
    server: [
        "MAIL_HOST",
        "MAIL_USER",
        "MAIL_PASSWORD",
        "FIREBASE_TYPE",
        "FIREBASE_PRIVATE_KEY_ID",
        "FIREBASE_PRIVATE_KEY",
        "FIREBASE_CLIENT_EMAIL",
        "FIREBASE_CLIENT_ID",
        "FIREBASE_AUTH_URI",
        "FIREBASE_TOKEN_URI",
        "FIREBASE_AUTH_PROVIDER_X509_CERT_URL",
        "FIREBASE_CLIENT_X509_CERT_URL",
        "PORT",
        "JWT_SECRET",
    ],
});

module.exports = withConfig(
    withFonts(
        withImages(
            withCSS(
                withLess({
                    compress: false,
                    webpack(config, { isServer }) {
                        config.resolve.alias = {
                            ...config.resolve.alias,
                            "@root": path.resolve(__dirname),
                            "@app": path.resolve(__dirname, "app"),
                            "@pages": path.resolve(__dirname, "pages"),
                            "@api": path.resolve(__dirname, "pages/api"),
                        };

                        config.externals = [
                            ...(config.externals || []),
                            "react-native-sqlite-storage",
                        ];

                        if (!isServer) {
                            config.module.rules.push({
                                test: /react-native-sqlite-storage|cls-hooked|cron|firebase-admin|nodemailer|markdown-it/,
                                use: "null-loader",
                            });
                        }

                        config.context = __dirname;
                        config.node = {
                            __filename: true,
                            __dirname: true,
                        };

                        return config;
                    },
                    webpackDevMiddleware(config) {
                        config.watchOptions = {
                            ignored: /node_modules/,
                        };

                        return config;
                    },
                }),
            ),
        ),
    ),
);
