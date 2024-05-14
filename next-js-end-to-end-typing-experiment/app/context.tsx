import {
    Dispatch,
    SetStateAction,
    createContext,
    useState,
    useContext as useContext_,
} from "react";
import { getNamespace } from "cls-hooked";
import { AlertProps } from "@material-ui/lab/Alert";
import appConfig from "@app/config";
import { AccountView } from "@app/view/account";
import { Message } from "@app/firebase";
import User from "@app/user/user.entity";
import myself from "@api/myself";

export interface Context {
    drawerOpen: boolean;
    verifyEmail: string | undefined;
    accountView: AccountView;
    notification: Message["notification"] | undefined;
    user: User | undefined;
    snackbar: [string | undefined, AlertProps["severity"]];
}

type ContextProps<Context> = {
    context: Context;
    setContext: SetContext<Context>;
};

type SetContext<Context> = Dispatch<SetStateAction<Partial<Context>>>;

export const initialContext: Context = {
    drawerOpen: false,
    verifyEmail: undefined,
    accountView: undefined,
    notification: undefined,
    user: undefined,
    snackbar: [undefined, undefined],
};

function getHookedContext(): Context | undefined {
    const contextNamespace =
        typeof window === "undefined" ? getNamespace("context") : undefined;

    return contextNamespace?.get("context");
}

const ContextInstance = createContext({
    context: initialContext,
    setContext: (initialContext) => initialContext,
} as ContextProps<Context>);

export function ContextProvider({
    children,
    initialContext,
}: {
    children: JSX.Element;
    initialContext: Context;
}) {
    const [context, setContext] = useState(initialContext);

    if (
        typeof window !== "undefined" &&
        appConfig().nodeEnv === "development"
    ) {
        (window as any).__context = context;
    }

    return (
        <ContextInstance.Provider
            value={{
                context,
                setContext(nextContext) {
                    if (appConfig().nodeEnv === "development") {
                        console.log("contextUpdate", nextContext);
                    }

                    const nextContext_: Context = {
                        ...((window as any).__context ?? context),
                        ...nextContext,
                    };

                    (window as any).__context = nextContext_;
                    setContext(nextContext_);
                },
            }}
        >
            {children}
        </ContextInstance.Provider>
    );
}

export function useContext(): [Context, SetContext<Context>] {
    const { context, setContext } = useContext_(ContextInstance);
    return [context, setContext];
}

export default {
    async get(): Promise<Context> {
        const user = (await myself.get({})).data;
        return {
            ...(getHookedContext() ?? initialContext),
            user,
        };
    },
    set(context: Context) {
        const contextNamespace =
            typeof window === "undefined" ? getNamespace("context") : undefined;

        contextNamespace?.set("context", context);
    },
};
