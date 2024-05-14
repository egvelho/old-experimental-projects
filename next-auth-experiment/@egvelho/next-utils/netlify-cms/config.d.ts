import { CmsCollectionFile, CmsField, CmsCollection, CmsConfig } from "netlify-cms-core";
export declare function files(label: string, files: CmsCollectionFile[]): CmsCollection;
export declare function file(label: string, file: string, fields: CmsField[]): CmsCollectionFile;
export declare function folder(options: {
    label: string;
    label_singular: string;
    folder: string;
} & Partial<CmsCollection>, fields: CmsField[]): CmsCollection;
export declare function getCmsConfig({ locale, localBackend, collections, }: {
    locale?: string | undefined;
    localBackend?: string | undefined;
    collections?: CmsCollection[] | undefined;
}): {
    config: CmsConfig;
};
