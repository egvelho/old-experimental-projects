import React from "react";
export declare type BannerWithButtonProps = {
    title: React.ReactNode;
    label: string;
    color: string;
    background: string;
    image: string;
    darkOverlay?: boolean;
    lightOverlay?: boolean;
} & ({
    href: string;
} | {
    onClick: () => void;
});
export declare function BannerWithButton({ title, label, color, background, image, darkOverlay, lightOverlay, ...buttonProps }: BannerWithButtonProps): JSX.Element;
