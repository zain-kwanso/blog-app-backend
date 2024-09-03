"use strict";
import dotenv from "dotenv";
import pg from "pg";
import { Dialect, Sequelize } from "sequelize";
import configFile from "../config/config.ts";
enum Environment {
  Development = "development",
  Test = "test",
  Production = "production",
}

const env: Environment =
  (process.env.NODE_ENV as Environment) || Environment.Development;

const config = configFile[env];

dotenv.config();
const dialect = config.dialect as Dialect;

let sequelize: Sequelize;
if (env === "production") {
  sequelize = new Sequelize(config.database!, {
    dialect: dialect,
    dialectModule: pg,
  });
} else {
  sequelize = new Sequelize(
    config.database!,
    config.username,
    config.password!,
    {
      host: config.host,
      dialect: dialect,
    }
  );
}

export default sequelize;
