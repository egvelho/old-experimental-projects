/// <reference types="react" />
import { GetStaticProps, GetStaticPropsContext, GetStaticPaths, GetStaticPathsContext, GetServerSideProps, GetServerSidePropsContext } from "next";
import { Links, ExtractLinkQuery, ExtractLinkProps } from "./link";
export declare type ChangeFrequency = "always" | "hourly" | "daily" | "weekly" | "monthly" | "anual" | "never";
export declare type Page<Props, Query> = {
    getStaticProps: (getStaticProps: (query: Query, context: GetStaticPropsContext<any>) => Promise<Props>) => GetStaticProps<Props, any>;
    getStaticPaths: (getStaticPaths: (context: GetStaticPathsContext) => Promise<Query[]>) => GetStaticPaths<any>;
    getServerSideProps: (getServerSideProps: (query: Query, context: GetServerSidePropsContext<any>) => Promise<Props>) => GetServerSideProps<Props, any>;
    getServerSidePaths: (getServerSidePaths: () => Promise<Query[]>) => () => Promise<Query[]>;
    page: (page: (props: Props) => JSX.Element) => (props: Props) => JSX.Element;
    disallow: (disallow: boolean) => boolean;
    priority: (priority: number) => number;
    changeFrequency: (changeFrequency: ChangeFrequency) => ChangeFrequency;
    getLastModificationDate: (getLastModificationDate: (query: Query) => Promise<Date>) => (query: Query) => Promise<Date>;
};
export declare type Pages<Api> = {
    [key in keyof Api]: Page<ExtractLinkProps<Api[key]>, ExtractLinkQuery<Api[key]>>;
};
export declare function getPages<Api extends Links<Api>>(links: Api): Pages<Api>;
