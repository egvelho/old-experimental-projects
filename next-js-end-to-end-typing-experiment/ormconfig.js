require("dotenv").config();

const { NODE_ENV = "development" } = process.env;

const prodConfig = {
    logger: "advanced-console",
    logging: "all",
};

const devConfig = {
    keepConnectionAlive: true,
    logging: false,
};

const config =
    NODE_ENV.replace(/(\r\n|\n|\r)/gm, "") === "development"
        ? devConfig
        : prodConfig;

module.exports = {
    ...config,
    migrations: ["./migrations/*.ts"],
    entities: ["./app/**/*.entity.ts"],
    subscribers: ["./app/**/*.subscription.ts"],
    factories: ["./app/**/*.factory.ts"],
    seeds: ["./app/**/*.seed.ts"],
    cache: true,
    maxQueryExecutionTime: 15000,
    dropSchema: false,
    migrationsRun: true,
    synchronize: false,
    database: "./database.sqlite",
    type: "sqlite",
    cli: {
        migrationsDir: "./migrations",
    },
};
