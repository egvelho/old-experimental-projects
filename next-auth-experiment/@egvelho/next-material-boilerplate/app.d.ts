import { ReactNode } from "react";
import { AppProps } from "next/app";
import { Theme } from "@material-ui/core";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import MuiCssBaseline from "@material-ui/core/CssBaseline";
export declare function app({ theme, Layout, ThemeProvider, CssBaseline, }: {
    theme: Theme;
    Layout: ({ children }: {
        children: ReactNode;
    }) => JSX.Element;
    ThemeProvider: typeof MuiThemeProvider;
    CssBaseline: typeof MuiCssBaseline;
}): ({ Component, pageProps }: AppProps) => JSX.Element;
