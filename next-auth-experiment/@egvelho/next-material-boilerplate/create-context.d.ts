import React from "react";
export declare function createContext<ContextProps extends Object>(initialContext: ContextProps, persistKeys?: (keyof ContextProps)[]): {
    Context: React.Context<{
        context: ContextProps & Partial<unknown>;
        setContext(context: Partial<ContextProps>): void;
    }>;
    useContext(): {
        context: ContextProps & Partial<unknown>;
        setContext(context: Partial<ContextProps>): void;
    };
    ContextProvider({ children }: {
        children: JSX.Element;
    }): JSX.Element;
    getContext(): {
        context: ContextProps;
        setContext: (context: Partial<ContextProps>) => void;
    };
};
