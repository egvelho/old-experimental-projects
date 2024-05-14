import React from "react";
export interface BreadcrumbsProps {
    breadcrumbs: [React.ReactNode, string][];
}
export declare function Breadcrumbs({ breadcrumbs }: BreadcrumbsProps): JSX.Element;
