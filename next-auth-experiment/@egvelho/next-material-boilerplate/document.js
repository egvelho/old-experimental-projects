"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.document = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const document_1 = tslib_1.__importStar(require("next/document"));
function document({ lang = "pt-BR", ServerStyleSheets, }) {
    return class Document extends document_1.default {
        static getInitialProps(context) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const sheets = new ServerStyleSheets();
                const renderPage = context.renderPage;
                context.renderPage = () => renderPage({
                    enhanceApp: (App) => (props) => sheets.collect(react_1.default.createElement(App, Object.assign({}, props))),
                });
                const initialProps = yield document_1.default.getInitialProps(context);
                return Object.assign(Object.assign({}, initialProps), { styles: [
                        ...react_1.Children.toArray(initialProps.styles),
                        sheets.getStyleElement(),
                    ] });
            });
        }
        render() {
            return (react_1.default.createElement(document_1.Html, { lang: lang },
                react_1.default.createElement(document_1.Head, null),
                react_1.default.createElement("body", null,
                    react_1.default.createElement(document_1.Main, null),
                    react_1.default.createElement(document_1.NextScript, null))));
        }
    };
}
exports.document = document;
//# sourceMappingURL=document.js.map