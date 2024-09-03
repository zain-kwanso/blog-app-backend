import { Model, Sequelize } from "sequelize";
import { UserInstance } from "./models/user";
import { PostInstance } from "./models/post";
import { CommentInstance } from "./models/comment";

export type data<T, U> = Model<T, U> & T;

export interface IDb {
  User: UserInstance;
  Post: PostInstance;
  Comment: CommentInstance;
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
}
