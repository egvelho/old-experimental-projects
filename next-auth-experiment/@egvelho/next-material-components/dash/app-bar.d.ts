/// <reference types="react" />
import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import { SvgIconTypeMap } from "@material-ui/core";
declare type Item = {
    label: string;
} & ({
    href: string;
} | {
    onClick: () => void;
});
export interface AppBarProps {
    backgroundColor: string;
    color: string;
    shortName: string;
    logo: string;
    items: Item[];
    itemsAriaLabel: string;
    drawerButtonAriaLabel: string;
    setDrawerOpen: (drawerOpen: boolean) => void;
    drawerIcon?: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
}
export declare function AppBar({ backgroundColor, color, shortName, logo, items, itemsAriaLabel, drawerButtonAriaLabel, setDrawerOpen, drawerIcon, }: AppBarProps): JSX.Element;
export {};
