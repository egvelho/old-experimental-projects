require("dotenv").config();

const favicons = require("favicons");
const fs = require("fs");
const app = require("../app.json");

function generateAssets() {
    console.log("Just wait, it may take some minutes...");

    const configuration = {
            path: "/",
            appName: app.name,
            appShortName: app.shortName,
            appDescription: app.description,
            developerName: app.developerName,
            developerURL: app.developerURL,
            dir: "auto",
            lang: app.lang,
            background: app.backgroundColor,
            theme_color: app.dashColor,
            appleStatusBarStyle: "default",
            display: "standalone",
            orientation: app.orientation,
            scope: "/",
            start_url: "/",
            version: app.version,
            logging: false,
            pixel_art: false,
            loadManifestWithCredentials: false,
            icons: {
                android: true,
                appleIcon: true,
                appleStartup: true,
                coast: false,
                favicons: true,
                firefox: true,
                windows: true,
                yandex: false,
            },
        },
        callback = (error, response) => {
            if (error) {
                console.error(error.message);
                return;
            }

            [...response.images, ...response.files].forEach(
                ({ name, contents }) => {
                    console.log(`Writing to public/${name}...`);
                    fs.writeFile(
                        `public/${name}`,
                        contents,
                        "binary",
                        (error) => error && console.log(error),
                    );
                },
            );
        };

    favicons(app.iconPath, configuration, callback);
}

generateAssets();
