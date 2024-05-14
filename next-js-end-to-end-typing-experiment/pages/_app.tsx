import { AppProps } from "next/app";
import { Component } from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ContextProvider, initialContext } from "@app/context";
import theme from "@app/view/theme";
import Dash from "@app/view/dash";
import { WithFirebase } from "@app/firebase";
import "@app/view/roboto/roboto.css";
import "@app/view/material-icons/material-icons.css";

// @ts-ignore
import { PageTransition } from "next-page-transitions";

export default class App extends Component<AppProps> {
    componentDidMount() {
        const jssStyles = document.querySelector("#jss-server-side");
        if (jssStyles && jssStyles.parentElement !== null) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }

    render() {
        const { Component, pageProps } = this.props;

        return (
            <>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <ContextProvider
                        initialContext={pageProps.__context ?? initialContext}
                    >
                        <>
                            <WithFirebase />
                            <Dash>
                                <>
                                    <PageTransition
                                        timeout={300}
                                        classNames="page-transition"
                                    >
                                        <Component {...pageProps} />
                                    </PageTransition>
                                    <style jsx global>{`
                                        .page-transition-enter {
                                            opacity: 0;
                                            transform: translate3d(0, 20px, 0);
                                        }
                                        .page-transition-enter-active {
                                            opacity: 1;
                                            transform: translate3d(0, 0, 0);
                                            transition: opacity 300ms,
                                                transform 300ms;
                                        }
                                        .page-transition-exit {
                                            opacity: 1;
                                        }
                                        .page-transition-exit-active {
                                            opacity: 0;
                                            transition: opacity 300ms;
                                        }
                                    `}</style>
                                </>
                            </Dash>
                        </>
                    </ContextProvider>
                </ThemeProvider>
            </>
        );
    }
}
