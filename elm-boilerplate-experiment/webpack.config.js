const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const elmMinify = require("elm-minify");
const TerserPlugin = require("terser-webpack-plugin");
const WebpackShellPlugin = require("webpack-shell-plugin");
const SpriteLoaderPlugin = require("svg-sprite-loader/plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const dotenv = require("dotenv").config({ path: __dirname + "/.env" });

process.env = {
    ...dotenv.parsed,
    ...process.env,
};

const MODE =
    process.env.npm_lifecycle_event === "prod" ? "production" : "development";
const withDebug = MODE === "development";

const svgFilename = "sprites.svg";

const hash = Math.random().toString(36).substring(2, 15);

const jsPath = MODE === "production" ? `index-${hash}.js` : "index.js";
const cssPath = MODE === "production" ? `styles-${hash}.css` : "styles.css";
const svgPath = MODE === "production" ? `sprites-${hash}.svg` : svgFilename;

console.log(
    "\x1b[36m%s\x1b[0m",
    `** elm-boilerplate: mode "${MODE}", withDebug: ${withDebug}\n`,
);

const common = {
    mode: MODE,
    entry: "./js/index.js",
    output: {
        path: path.join(__dirname, "dist"),
        publicPath: "/",
        filename: jsPath,
    },
    plugins: [
        new HTMLWebpackPlugin({
            filename: "index.html",
            template: "./index.html",
            inject: true,
            templateParameters: {
                spriteFilename: svgFilename,
            },
            minify: {
                collapseWhitespace: true,
            },
        }),
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, "assets"),
                transform(content, filePath) {
                    if (
                        path.basename(filePath) === "firebase-messaging-sw.js"
                    ) {
                        return content
                            .toString()
                            .replace(
                                "__FIREBASE_MESSAGING_SENDER_ID__",
                                process.env.FIREBASE_MESSAGING_SENDER_ID,
                            );
                    } else {
                        return content;
                    }
                },
            },
        ]),
        new SpriteLoaderPlugin(),
    ],
    resolve: {
        modules: [path.join(__dirname, "js"), "node_modules"],
        extensions: [".js", ".elm", ".css", ".json"],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/elm-stuff/, /node_modules/],
                use: [
                    {
                        loader: "babel-loader",
                    },
                ],
            },
            {
                test: /\.woff$/,
                exclude: [/elm-stuff/, /node_modules/],
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 9999999,
                        },
                    },
                ],
            },
            {
                test: /\.svg$/,
                exclude: [/elm-stuff/, /node_modules/],
                use: [
                    {
                        loader: "svg-sprite-loader",
                        options: {
                            extract: true,
                            publicPath: "./",
                            spriteFilename: svgFilename,
                        },
                    },
                    "svgo-loader",
                ],
            },
            {
                test: /(injectSvgSprite\.js$)/,
                loader: "string-replace-loader",
                options: {
                    multiple: [
                        {
                            search: "__SPRITE_PATH__",
                            replace: svgPath,
                        },
                    ],
                },
            },
            {
                test: /(injectEnv\.js$)/,
                loader: "string-replace-loader",
                options: {
                    multiple: [
                        {
                            search: "__ENV__",
                            replace: JSON.stringify(process.env),
                        },
                    ],
                },
            },
        ],
    },
};

if (MODE === "development") {
    module.exports = merge(common, {
        devtool: "inline-source-map",
        plugins: [
            new webpack.NamedModulesPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
        ],
        module: {
            rules: [
                {
                    test: /\.css$/,
                    exclude: [/elm-stuff/, /node_modules/],
                    use: ["style-loader", "css-loader"],
                },
                {
                    test: /\.scss$/,
                    exclude: [/elm-stuff/, /node_modules/],
                    loaders: ["style-loader", "css-loader", "sass-loader"],
                },
                {
                    test: /\.elm$/,
                    exclude: [/elm-stuff/, /node_modules/],
                    use: [
                        { loader: "elm-hot-webpack-loader" },
                        {
                            loader: "elm-webpack-loader",
                            options: {
                                debug: withDebug,
                                forceWatch: true,
                            },
                        },
                    ],
                },
            ],
        },
        devServer: {
            host: "0.0.0.0",
            port: "3000",
            inline: true,
            stats: "errors-only",
            contentBase: path.join(__dirname, "dist"),
            historyApiFallback: true,
        },
    });
}
if (MODE === "production") {
    module.exports = merge(common, {
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                    terserOptions: {
                        ecma: 6,
                        output: { comments: false },
                    },
                }),
            ],
        },
        plugins: [
            new CleanWebpackPlugin({
                root: __dirname,
                exclude: [],
                verbose: true,
                dry: false,
            }),
            new elmMinify.WebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: cssPath,
            }),
            new WebpackShellPlugin({
                onBuildStart: [],
                onBuildEnd: [
                    `mv ${path.join(
                        __dirname,
                        "dist",
                        svgFilename,
                    )} ${path.join(__dirname, "dist", svgPath)}`,
                ],
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.css$/,
                    exclude: [/elm-stuff/, /node_modules/],
                    use: [MiniCssExtractPlugin.loader, "css-loader"],
                },
                {
                    test: /\.scss$/,
                    exclude: [/elm-stuff/, /node_modules/],
                    loaders: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        "sass-loader",
                    ],
                },
                {
                    test: /\.elm$/,
                    exclude: [/elm-stuff/, /node_modules/],
                    use: {
                        loader: "elm-webpack-loader",
                        options: {
                            optimize: true,
                        },
                    },
                },
            ],
        },
    });
}
