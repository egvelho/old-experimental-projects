import React from "react";
import NextDocument, { DocumentContext, DocumentProps } from "next/document";
import { ServerStyleSheets as MuiServerStyleSheets } from "@material-ui/core/styles";
export declare function document({ lang, ServerStyleSheets, }: {
    lang?: string;
    ServerStyleSheets: typeof MuiServerStyleSheets;
}): {
    new (props: DocumentProps | Readonly<DocumentProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<DocumentProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<DocumentProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<DocumentProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<DocumentProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<DocumentProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<DocumentProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<DocumentProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<DocumentProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<DocumentProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: DocumentProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<DocumentProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<DocumentProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<DocumentProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<DocumentProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<DocumentProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<DocumentProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<DocumentProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<DocumentProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<DocumentProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    getInitialProps(context: DocumentContext): Promise<{
        styles: {}[];
        html: string;
        head?: (JSX.Element | null)[] | undefined;
    }>;
    headTagsMiddleware: Promise<any> | (() => never[]);
    renderDocument<P>(DocumentComponent: new () => NextDocument<P>, props: import("next/dist/next-server/lib/utils").RenderPageResult & {
        styles?: {} | React.ReactNodeArray | React.ReactElement<any, string | ((props: any) => React.ReactElement<any, any> | null) | (new (props: any) => React.Component<any, any, any>)>[] | undefined;
    } & {
        __NEXT_DATA__: import("next/dist/next-server/lib/utils").NEXT_DATA;
        dangerousAsPath: string;
        docComponentsRendered: {
            Html?: boolean | undefined;
            Main?: boolean | undefined;
            Head?: boolean | undefined;
            NextScript?: boolean | undefined;
        };
        buildManifest: import("next/dist/next-server/server/get-page-files").BuildManifest;
        ampPath: string;
        inAmpMode: boolean;
        hybridAmp: boolean;
        isDevelopment: boolean;
        dynamicImports: import("next/dist/next-server/server/load-components").ManifestItem[];
        assetPrefix?: string | undefined;
        canonicalBase: string;
        headTags: any[];
        unstable_runtimeJS?: false | undefined;
        unstable_JsPreload?: false | undefined;
        devOnlyCacheBusterQueryString: string;
        scriptLoader: {
            defer?: string[] | undefined;
            eager?: any[] | undefined;
        };
        locale?: string | undefined;
    } & P): React.ReactElement<any, string | ((props: any) => React.ReactElement<any, any> | null) | (new (props: any) => React.Component<any, any, any>)>;
    contextType?: React.Context<any> | undefined;
};
