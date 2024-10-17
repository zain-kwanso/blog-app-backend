import { Optional } from "sequelize";

export interface Comment {
  id: number;
  content: string;
  UserId: number;
  PostId: number;
  ParentId?: number;
}

export interface CommentCreationAttributes
  extends Optional<CommentAttributes, "id" | "UserId"> {}

export type CommentInstance = data<Comment, CommentCreationAttributes>;

export interface ResComment {
  id: number;
  UserId: number;
  content: string;
  PostId: number;
  ParentId?: number | null;
  createdAt: string;
  updatedAt: string;
  User: UserForComment;
  replies?: ResComment[];
}

export type CommentResponse = ResComment[];
