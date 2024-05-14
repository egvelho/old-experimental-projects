/// <reference types="react" />
import { SvgIconTypeMap } from "@material-ui/core";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";
declare type Item = {
    label: string;
    Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
} & ({
    href: string;
} | {
    onClick: () => void;
});
export interface BottomNavigationProps {
    items: Item[];
}
export declare function BottomNavigation({ items }: BottomNavigationProps): JSX.Element;
export {};
