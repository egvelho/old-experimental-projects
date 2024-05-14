import React from "react";
import { AppBarProps } from "./app-bar";
import { BottomNavigationProps } from "./bottom-navigation";
import { DrawerProps } from "./drawer";
import { FooterProps } from "./footer";
import { SnackbarProps } from "./snackbar";
export interface DashProps {
    children: React.ReactNode;
    appBarBackgroundColor: AppBarProps["backgroundColor"];
    appBarColor: AppBarProps["color"];
    shortName: AppBarProps["shortName"];
    logo: AppBarProps["logo"];
    appBarItems: AppBarProps["items"];
    appBarItemsAriaLabel: AppBarProps["itemsAriaLabel"];
    drawerButtonAriaLabel: AppBarProps["drawerButtonAriaLabel"];
    drawerItemsAriaLabel: DrawerProps["itemsAriaLabel"];
    drawerItems: DrawerProps["items"];
    drawerOpen: DrawerProps["drawerOpen"];
    setDrawerOpen: DrawerProps["setDrawerOpen"];
    footerItemsAriaLabel: FooterProps["itemsAriaLabel"];
    footerItems: FooterProps["items"];
    bottomNavigationItems: BottomNavigationProps["items"];
    snackbarContent: SnackbarProps["content"];
    setSnackbarContent: SnackbarProps["setContent"];
}
export declare function Dash({ appBarBackgroundColor, appBarColor, logo, shortName, appBarItems, appBarItemsAriaLabel, drawerButtonAriaLabel, drawerItemsAriaLabel, drawerItems, drawerOpen, setDrawerOpen, footerItemsAriaLabel, footerItems, bottomNavigationItems, snackbarContent, setSnackbarContent, children, }: DashProps): JSX.Element;
