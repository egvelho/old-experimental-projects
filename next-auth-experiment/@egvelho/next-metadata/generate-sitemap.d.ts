export interface Url {
    disallow: boolean;
    priority: number;
    changefreq: string;
    lastmod: string;
    url: string;
}
export declare function generateSitemap({ outPath, mapPathToImport, }: {
    outPath?: string;
    mapPathToImport: (path: string) => Promise<any>;
}): Promise<void>;
