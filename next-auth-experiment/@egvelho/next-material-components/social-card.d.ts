/// <reference types="react" />
import { SocialIconsProps } from "./social-icons";
export declare type SocialCardProps = {
    name: string;
    nameColor?: string;
    description: string;
    about: string;
    picture?: string;
    tags?: string[];
    elevation?: number;
} & SocialIconsProps;
export declare function SocialCard({ name, nameColor, description, about, picture, tags, elevation, ...socialIconsProps }: SocialCardProps): JSX.Element;
