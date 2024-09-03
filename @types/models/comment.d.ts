import { Optional } from "sequelize";

export interface CommentAttributes {
  id: number;
  content: string;
  UserId: number;
  PostId: number;
  ParentId?: number;
}

export interface CommentCreationAttributes
  extends Optional<CommentAttributes, "id" | "ParentId"> {}

export type CommentInstance = data<
  CommentAttributes,
  CommentCreationAttributes
>;
