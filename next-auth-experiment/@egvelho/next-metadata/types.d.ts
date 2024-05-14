import { MetaPageUrlProps } from "./meta/page-url";
import { MetaImageProps } from "./meta/image";
import { MetaKeywordsProps } from "./meta/keywords";
export declare type PageMeta = MetaKeywordsProps & MetaImageProps & MetaPageUrlProps;
export interface App {
    name: string;
    shortName: string;
    description: string;
    twitterAt?: string;
    facebookAppId?: string;
    iconPath: string;
    version: string;
    developerName: string;
    developerURL: string;
    backgroundColor: string;
    dashColor: string;
    primaryColor: string;
    secondaryColor: string;
    lang: string;
    orientation: "portrait" | "landscape";
}
export declare type Json = {
    [key: string]: any;
} | Array<any>;
