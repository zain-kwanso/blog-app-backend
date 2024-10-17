"use strict";
import dotenv from "dotenv";
import pg from "pg";
import { Sequelize } from "sequelize";
import configFile from "../config/config.ts";
var Environment;
(function (Environment) {
    Environment["Development"] = "development";
    Environment["Test"] = "test";
    Environment["Production"] = "production";
})(Environment || (Environment = {}));
const env = process.env.NODE_ENV || Environment.Development;
const config = configFile[env];
dotenv.config();
const dialect = config.dialect;
let sequelize;
if (env === "production") {
    sequelize = new Sequelize(config.database, {
        dialect: dialect,
        dialectModule: pg,
    });
}
else {
    sequelize = new Sequelize(config.database, config.username, config.password, {
        host: config.host,
        dialect: dialect,
        port: 5433,
    });
}
export default sequelize;
