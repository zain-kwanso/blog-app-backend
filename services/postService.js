// postService.js

import Op from "sequelize";

import Post from "../models/post.js";
import Comment from "../models/comment.js";

// const Post = db.Post;
// const Comment = db.Comment;

// Helper function to find the post by ID
const findPostByIdService = async (postId) => {
  return await Post.findOne({
    where: {
      id: postId,
    },
  });
};

// Helper function to check if the user is authorized to delete the post
const isUserAuthorized = (post, userId) => post.UserId === userId;

// Helper function to delete comments associated with the post
const deleteCommentsByPostIdService = async (postId) => {
  return await Comment.destroy({
    where: {
      PostId: postId,
    },
  });
};

// Helper function to construct next page URL
const constructNextPageUrlService = (req, nextPage, limit) =>
  nextPage
    ? `${req.protocol}://${req.get("host")}${
        req.baseUrl
      }?page=${nextPage}&limit=${limit}&search=${req.query.search || ""}`
    : null;

// Helper function to fetch posts with pagination and search
const fetchPostsWithPaginationAndSearch = async (
  page,
  limit,
  search,
  userId
) => {
  const offset = (page - 1) * limit;
  const searchCondition = search
    ? {
        [Op.or]: [
          { title: { [Op.iLike]: `%${search}%` } },
          { content: { [Op.iLike]: `%${search}%` } },
        ],
      }
    : {};

  const userCondition = userId ? { UserId: userId } : {};

  const whereCondition = { ...searchCondition, ...userCondition };

  const { count, rows } = await Post.findAndCountAll({
    where: whereCondition,
    include: {
      model: Comment,
      where: { ParentId: null },
      required: false,
      include: {
        model: Comment,
        as: "replies",
        required: false,
        include: {
          model: Comment,
          as: "replies",
          required: false,
        },
      },
    },
    limit,
    offset,
  });

  const totalPages = Math.ceil((count - 1) / limit);
  const nextPage = page < totalPages ? page + 1 : null;

  return { rows, totalPages, nextPage };
};

// Create a new post
const createPostService = async (userId, postData) => {
  return await Post.create({ UserId: userId, ...postData });
};

// Get a post by ID
const getPostService = async (postId) => {
  return await Post.findByPk(postId);
};

// Update a post
const updatePostService = async (post, updatedData) => {
  return await post.update(updatedData);
};

// Delete a post
const deletePostService = async (post) => {
  return await post.destroy();
};

export {
  findPostByIdService,
  isUserAuthorized,
  deleteCommentsByPostIdService,
  fetchPostsWithPaginationAndSearch,
  createPostService,
  getPostService,
  updatePostService,
  deletePostService,
  constructNextPageUrlService,
};
