"use strict";
import dotenv from "dotenv";
import pg from "pg";
import { Sequelize, DataTypes } from "sequelize";
import configFile from "../config/config.js";
const env = process.env.NODE_ENV || "development";

const config = configFile[env];
dotenv.config();
let sequelize;
if (env == "production") {
  sequelize = new Sequelize(process.env.POSTGRES_URL, {
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
