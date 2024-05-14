import React from "react";
export interface BannerProps {
    image: string;
    imageAlt: string;
    imageWidth?: number;
    background: string;
    color: string;
    title: React.ReactNode;
    subtitle: React.ReactNode;
}
export declare function Banner({ image, imageAlt, imageWidth, background, color, title, subtitle, }: BannerProps): JSX.Element;
