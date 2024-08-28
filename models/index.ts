import User from "./user.ts";
import Post from "./post.ts";
import Comment from "./comment.ts";
// @ts-ignore
import sequelize from "../sequelize/config.ts";
import { Sequelize } from "sequelize";

interface IDb {
  User: typeof User;
  Post: typeof Post;
  Comment: typeof Comment;
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
}

const db: IDb = {} as IDb;
db.User = User;
db.Post = Post;
db.Comment = Comment;

Object.keys(db).forEach((modelName: string) => {
  // @ts-ignore
  if (db[modelName].associate) {
    // @ts-ignore
    db[modelName].associate(db);
  }
});
// @ts-ignore
db.sequelize = sequelize;
db.Sequelize = Sequelize;
export default db;
