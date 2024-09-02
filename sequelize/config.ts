"use strict";
import dotenv from "dotenv";
import pg from "pg";
import { Sequelize } from "sequelize";
import configFile from "../config/config.ts";
const env = process.env.NODE_ENV || "development";
// @ts-ignore
const config = configFile[env];
dotenv.config();

let sequelize: Sequelize;
if (env === "production") {
  sequelize = new Sequelize(process.env.POSTGRES_URL as string, {
    dialect: config.dialect,
    dialectModule: pg,
  });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
  });
}

export default sequelize;
