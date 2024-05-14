require("dotenv").config();

import "reflect-metadata";
import { initializeApp, credential } from "firebase-admin";
import { createConnection } from "typeorm";
import next from "next";
import { createServer as createLocalServer } from "http";
import { parse } from "url";
import { sync } from "glob";
import { CronJob } from "cron";
import appConfig from "@app/config";
import cron from "@app/cron";

const { NODE_ENV = "development" } = process.env;

const app = next({ dev: NODE_ENV === "development" });
const handle = app.getRequestHandler();

function startServer() {
    createLocalServer((req, res) => {
        const parsedUrl = parse(req.url ?? "", true);
        handle(req, res, parsedUrl);
    }).listen(appConfig().port, undefined, () => {
        console.log(`Server started at http://localhost:${appConfig().port}`);
    });
}

async function startCron() {
    const cronPromises = sync("app/**/*.cron.ts").map(async (path) => {
        const job = await (require(`../${path}`).default as ReturnType<
            typeof cron
        >)(CronJob);
        (await job).start();
    });

    await Promise.all(cronPromises);
}

function startFirebase() {
    const firebaseConfig = appConfig().firebase;

    initializeApp({
        credential: credential.cert(firebaseConfig),
        databaseURL: appConfig().firebase.databaseURL,
    });
}

(async function index() {
    await app.prepare();
    await createConnection();
    await startCron();
    startFirebase();
    startServer();
})();
