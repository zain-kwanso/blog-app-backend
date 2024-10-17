import User from "./user";
import Post from "./post";
import Comment from "./comment";
import sequelize from "../sequelize/config.ts";
import { Sequelize } from "sequelize";
var DbModelNames;
(function (DbModelNames) {
    DbModelNames["User"] = "User";
    DbModelNames["Post"] = "Post";
    DbModelNames["Comment"] = "Comment";
})(DbModelNames || (DbModelNames = {}));
const db = {};
db.User = User;
db.Post = Post;
db.Comment = Comment;
// (Object.keys(db) as Array<keyof typeof DbModelNames>).forEach((modelName) => {
//   const model = db[modelName];
//   if (model?.associate) {
//     model.associate(db);
//   }
// });
db.sequelize = sequelize;
db.Sequelize = Sequelize;
export default db;
