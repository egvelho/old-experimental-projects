import React from "react";
import { BreadcrumbsProps } from "./breadcrumbs";
export interface PageProps {
    header: React.ReactNode;
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbsProps["breadcrumbs"];
    background?: string;
    backgroundIsDark?: boolean;
    paper?: boolean;
}
export declare function Page({ header, children, breadcrumbs, background, backgroundIsDark, paper, }: PageProps): JSX.Element;
