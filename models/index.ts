import User from "./user.ts";
import Post from "./post.ts";
import Comment from "./comment.ts";
import sequelize from "../sequelize/config.ts";
import { Sequelize } from "sequelize";
import { IDb } from "../@types/sequelize";

enum DbModelNames {
  User = "User",
  Post = "Post",
  Comment = "Comment",
}

const db: IDb = {} as IDb;
db.User = User;
db.Post = Post;
db.Comment = Comment;

(Object.keys(db) as Array<keyof typeof DbModelNames>).forEach((modelName) => {
  const model = db[modelName];
  if (model?.associate) {
    model.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
export default db;
