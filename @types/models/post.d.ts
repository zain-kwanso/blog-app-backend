import { Optional } from "sequelize";

export interface Post {
  id: number;
  title: string;
  content: string;
  UserId: number;
}

export interface PostCreationAttributes
  extends Optional<PostAttributes, "id" | "UserId"> {}

export type PostInstance = data<Post, PostCreationAttributes>;

export interface PostResponse {
  id: number;
  UserId: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  authorName?: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  nextPageUrl: string | null;
  previousPageUrl: string | null;
}

export interface AllPostResponse {
  posts: Post[];
  pagination: Pagination;
}

export type DeleteEditResponse = {
  message: string;
};
