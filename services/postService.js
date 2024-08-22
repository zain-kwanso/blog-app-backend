// postService.js

import { Sequelize } from "sequelize";

import Post from "../models/post.js";
import Comment from "../models/comment.js";
import User from "../models/user.js";

// Helper function to find the post by ID
const findPostById = async (postId) => {
  return await Post.findOne({
    where: {
      id: postId,
    },
  });
};

// Helper function to check if the user is authorized to delete the post
const isUserAuthorized = (post, userId) => post.UserId === userId;

// Helper function to delete comments associated with the post
const deleteCommentsByPostId = async (postId) => {
  return await Comment.destroy({
    where: {
      PostId: postId,
    },
  });
};

// Helper function to construct next page URL
const constructNextPageUrl = (req, nextPage, limit) =>
  nextPage
    ? `${req.protocol}://${req.get("host")}${
        req.originalUrl.split("?")[0]
      }?page=${nextPage}&limit=${limit}&search=${req.query.search || ""}`
    : null;

// Helper function to construct next page URL
const constructPreviousPageUrl = (req, previousPage, limit) =>
  previousPage
    ? `${req.protocol}://${req.get("host")}${
        req.originalUrl.split("?")[0]
      }?page=${previousPage}&limit=${limit}&search=${req.query.search || ""}`
    : null;

// Helper function to fetch posts with pagination and search
const fetchPostsWithPaginationAndSearch = async (
  page = 1,
  limit = 10,
  search,
  userId
) => {
  const offset = (page - 1) * limit;
  const searchCondition = search
    ? {
        [Sequelize.Op.or]: [
          { title: { [Sequelize.Op.iLike]: `%${search}%` } },
          { content: { [Sequelize.Op.iLike]: `%${search}%` } },
        ],
      }
    : {};

  const userCondition = userId ? { UserId: userId } : {};
  const whereCondition = { ...searchCondition, ...userCondition };
  const { count, rows } = await Post.findAndCountAll({
    where: whereCondition,
    include: [
      {
        model: User,
        attributes: [],
      },
    ],
    attributes: {
      include: [[Sequelize.col("User.name"), "authorName"]],
    },
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  const totalPages = Math.ceil(count / limit);
  const nextPage = page < totalPages ? page + 1 : null;
  const previousPage = page > 1 ? page - 1 : null;
  return { rows, totalPages, nextPage, previousPage };
};

// Create a new post
const createPost = async (userId, postData) => {
  return await Post.create({ UserId: userId, ...postData });
};

// Get a post comments by ID
const getPostComments = async (postId) => {
  return await Comment.findAll({
    where: {
      PostId: postId,
      ParentId: null,
    },
    include: [
      {
        model: Comment,
        as: "replies",
        required: false,
        include: [
          {
            model: User,
            attributes: ["name"],
          },
        ],
      },
      {
        model: User,
        attributes: ["name"],
      },
    ],
  });
};

// Get a post by ID
const getPost = async (postId) => {
  return await Post.findByPk(postId);
};

// Update a post
const updatePost = async (post, updatedData) => {
  return await post.update(updatedData);
};

// Delete a post
const deletePost = async (post) => {
  return await post.destroy();
};

export {
  findPostById,
  isUserAuthorized,
  deleteCommentsByPostId,
  fetchPostsWithPaginationAndSearch,
  createPost,
  getPost,
  getPostComments,
  updatePost,
  deletePost,
  constructNextPageUrl,
  constructPreviousPageUrl,
};
