"use strict";
import dotenv from "dotenv";
import pg from "pg";
import { Sequelize, DataTypes } from "sequelize";
import configFile from "../config/config.js";
import userModel from "./user.js";
import postModel from "./post.js";
import commentModel from "./comment.js";
const env = process.env.NODE_ENV || "development";
const db = {};
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
db.User = userModel(sequelize, DataTypes);
db.Post = postModel(sequelize, DataTypes);
db.Comment = commentModel(sequelize, DataTypes);
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
export default db;
