import app from "@root/app.json";

import NextDocument, {
    Html,
    Head,
    Main,
    NextScript,
    DocumentContext,
    DocumentProps,
} from "next/document";
import { Children } from "react";
import { ServerStyleSheets } from "@material-ui/core/styles";
import MetaColor from "@app/meta/color";
import MetaDescription from "@app/meta/description";
import MetaHomeUrl from "@app/meta/home-url";
import MetaName from "@app/meta/name";
import MetaPageUrl from "@app/meta/page-url";
import MetaStatic from "@app/meta/static";
import MetaTitle from "@app/meta/title";
import MetaAuthor from "@app/meta/author";
import MetaImage from "@app/meta/image";
import MetaKeywords from "@app/meta/keywords";
import MetaFacebook from "@app/meta/facebook";
import MetaTwitter from "@app/meta/twitter";

export default class Document extends NextDocument<DocumentProps> {
    static async getInitialProps(context: DocumentContext) {
        const sheets = new ServerStyleSheets();
        const renderPage = context.renderPage;

        context.renderPage = () =>
            renderPage({
                enhanceApp: (App) => (props) =>
                    sheets.collect(<App {...props} />),
            });

        const initialProps = await NextDocument.getInitialProps(context);

        return {
            ...initialProps,
            styles: [
                ...Children.toArray(initialProps.styles),
                sheets.getStyleElement(),
            ],
        };
    }

    render() {
        return (
            <Html>
                <Head>
                    <MetaImage image="" />
                    <MetaKeywords keywords={[]} />
                    <MetaPageUrl url="" />
                    <MetaHomeUrl url="" />
                    <MetaName name={app.shortName} />
                    <MetaTitle title={app.name} />
                    <MetaDescription description={app.description} />
                    <MetaAuthor author={app.developerName} />
                    <MetaFacebook facebook={app.facebookAppId} />
                    <MetaTwitter twitter={app.twitterAt} />
                    <MetaColor color={app.primaryColor} />
                    <MetaStatic />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
