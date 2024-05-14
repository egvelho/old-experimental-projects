import { useEffect, useState } from "react";
import { set as setCookie } from "js-cookie";
import { apps, initializeApp, analytics, auth, messaging } from "firebase/app";
import "firebase/messaging";
import "firebase/analytics";
import "firebase/auth";
import { useContext } from "@app/context";
import appConfig from "@app/config";

export interface Message {
    data: unknown;
    notification: {
        title: string;
        body: string;
        tag: string;
        image?: string;
    };
}

export type UseFirebaseAuth = {
    loading: boolean;
    requestCode: (phoneNumber: string) => Promise<boolean>;
    verifyCode: (code: string) => Promise<boolean>;
};

export function WithFirebase() {
    const [, setContext] = useContext();

    useEffect(() => {
        Firebase.startOnClient({
            async onMessage({ notification }) {
                console.log("message", notification);
                setContext({ notification });
            },
            async onTokenRefresh(token) {
                console.log("token", token);
            },
        });
    }, []);

    return null;
}

export function useFirebaseAuth(): UseFirebaseAuth {
    const [state, setState] = useState({
        loading: false,
        confirmationResult: undefined as auth.ConfirmationResult | undefined,
    });

    return {
        loading: state.loading,
        async requestCode(phoneNumber: string) {
            setState({
                ...state,
                loading: true,
            });

            const confirmationResult = await Firebase.requestCode(phoneNumber);

            setState({
                ...state,
                loading: false,
                confirmationResult,
            });

            return !!confirmationResult;
        },
        async verifyCode(code: string) {
            setState({
                ...state,
                loading: true,
            });

            const token =
                state.confirmationResult &&
                (await Firebase.verifyCode({
                    code,
                    confirmationResult: state.confirmationResult,
                }));

            token && setCookie("token", token);

            setState({
                ...state,
                loading: false,
            });

            return !!token;
        },
    };
}

export default class Firebase {
    static async startOnClient({
        onMessage = async (message: Message) => {},
        onTokenRefresh = async (token: string) => {},
    } = {}) {
        if (apps.length) {
            return;
        }

        initializeApp(appConfig().firebase);
        analytics();
        auth().languageCode = "pt-BR";

        const messagingInstance = messaging();

        messagingInstance.usePublicVapidKey(
            appConfig().firebase.publicVapidKey,
        );

        if (!("Notification" in window)) {
            return;
        }

        const permission = await Notification.requestPermission();

        if (permission === "granted") {
            const token = await messagingInstance.getToken();
            onTokenRefresh(token);
        }

        messagingInstance.onTokenRefresh(async () => {
            const token = await messagingInstance.getToken();
            onTokenRefresh(token);
        });

        messagingInstance.onMessage(onMessage);
    }

    static async verifyCode({
        confirmationResult,
        code,
    }: {
        confirmationResult: auth.ConfirmationResult;
        code: string;
    }) {
        try {
            const result = await confirmationResult.confirm(code);
            const token = await result.user?.getIdToken();
            return token;
        } catch {
            return undefined;
        }
    }

    static async requestCode(
        phoneNumber: string,
        countryPrefix: string = "+55",
    ) {
        let success = false;

        const container = document.createElement("div");
        const body = document.querySelector("body");

        container.id = `recaptcha-container-${Math.random() * 255}`.replace(
            ".",
            "-",
        );
        container.style.display = "none";
        body?.appendChild(container);

        const recaptchaVerifier = new auth.RecaptchaVerifier(container.id, {
            size: "invisible",
            callback: () => (success = true),
        });

        const id = await recaptchaVerifier.render();
        // @ts-ignore
        grecaptcha.execute(id);

        while (!success) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        try {
            const confirmationResult = await auth().signInWithPhoneNumber(
                `${countryPrefix}${phoneNumber.replace(/\D+/g, "")}`,
                recaptchaVerifier,
            );

            return confirmationResult;
        } catch {
            return undefined;
        } finally {
            const containerElement = document.querySelector(`#${container.id}`);
            containerElement && body?.removeChild(containerElement);
        }
    }
}
