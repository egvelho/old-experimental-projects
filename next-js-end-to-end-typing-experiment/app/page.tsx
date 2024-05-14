import nextCookies from "next-cookies";
import { createNamespace, getNamespace } from "cls-hooked";
import { NextPage, NextPageContext } from "next";
import Link from "next/link";
import Router from "next/router";
import appContext from "@app/context";

if (typeof window === "undefined") {
    createNamespace("context");
}

type Page<Props, InitialProps, Query extends QueryParams> = NextPage<
    Props,
    InitialProps
> & {
    Link: PageLink<Query>;
    pushUrl: (query: Query) => void;
};

type PageLink<Query extends QueryParams> = (
    props: QueryProps<Query>,
) => JSX.Element;

type QueryParams = { [key: string]: string | (string | undefined) };

type QueryProps<Query extends QueryParams> = {
    query: Query;
    children: React.ReactNode;
};

function getUrlParams(path?: string): Object {
    if (typeof window === "undefined" || !path) {
        return {};
    }

    const url_ = new URL(`${window.location.origin}${path}`);
    const params = new URLSearchParams(url_.search);

    let entries: any = {};

    for (let entry of (params as any).entries()) {
        let [key, value] = entry;
        entries[key] = value;
    }

    return entries;
}

function getUrl<Query extends QueryParams>(filename: string, query: Query) {
    const filename_ = filename.replace(/\\/g, "/");
    const url = filename_.match(/pages(.*)\.ts/)?.pop() ?? "";

    const query_: any = Object.keys(query).reduce(
        (stack, input) =>
            query[input] === undefined
                ? stack
                : { [input]: query[input], ...stack },
        query,
    );

    const url_ = Object.keys(query_).reduce((stack, input) => {
        if (stack.includes(`[${input}]`)) {
            const nextStack = stack.replace(`[${input}]`, query_[input]);
            delete query_[input];
            return nextStack;
        } else {
            return stack;
        }
    }, url);

    const parsedUrl = Object.keys(query_).reduce(
        (stack, input) => {
            if (stack.endsWith("?")) {
                return `${stack}${input}=${query_[input]}`;
            } else {
                return `${stack}&${input}=${query_[input]}`;
            }
        },
        Object.keys(query_).length === 0 ? url_ : `${url_}?`,
    );

    return [url, parsedUrl];
}

export default function page<
    Props,
    InitialProps = Props,
    Query extends QueryParams = {}
>(
    filename: string,
    {
        render,
        init,
    }: {
        render: NextPage<Props, InitialProps>;
        init?: (
            query: Query,
            context: NextPageContext,
        ) => Promise<InitialProps>;
    },
): Page<Props, InitialProps, Query> {
    const Page: any = render;

    const PageLink: PageLink<Query> = ({ query, children }) => {
        const [url, parsedUrl] = getUrl(filename, query);

        return (
            <Link href={url} as={parsedUrl} passHref>
                {children}
            </Link>
        );
    };

    const pushUrl: (query: Query) => void = (query) => {
        const [url, parsedUrl] = getUrl(filename, query);
        Router.push(url, parsedUrl);
    };

    Page.Link = PageLink;
    Page.pushUrl = pushUrl;

    (Page as NextPage<Props, InitialProps>).getInitialProps = async (
        context,
    ) => {
        const query: Query = {
            ...getUrlParams(context.asPath),
            ...(context.query as any),
        };

        if (typeof window === "undefined") {
            const { token } = nextCookies(context);
            const contextNamespace = getNamespace("context");
            const props: InitialProps = await new Promise((resolve) =>
                contextNamespace.run(() => {
                    contextNamespace.set("token", token);
                    appContext.get().then((contextProps) => {
                        contextNamespace.set("context", contextProps);

                        if (init) {
                            init(query, context).then((props) => {
                                (props as any).__context = contextProps;
                                resolve(props);
                            });
                        } else {
                            resolve({
                                __context: contextProps,
                            } as any);
                        }
                    });
                }),
            );
            return props;
        }

        return init ? init(query, context) : ({} as any);
    };

    return Page;
}
