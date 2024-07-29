// commentService.js
import db from "../models/index.js";

const Comment = db.Comment;
const Post = db.Post;

// Helper function to find the comment by ID
const findCommentById = async (commentId) =>
  await Comment.findOne({
    where: { id: commentId },
    include: {
      model: Post,
      attributes: ["UserId"],
    },
  });

// Helper function to check authorization
const isAuthorizedToDelete = (commentUserID, postUserID, currentUserID) =>
  commentUserID == currentUserID || postUserID == currentUserID;

// Helper function to check if the user is authorized to update the comment
const isUserAuthorizedToUpdate = (comment, userID) =>
  comment.userID === userID || comment.Post.userID === userID;

// Helper function to delete comment
const deleteCommentService = async (commentId) => {
  await Comment.destroy({
    where: {
      id: commentId,
    },
  });
};

// Create a new comment
const createCommentService = async (userId, commentData) => {
  return await Comment.create({
    UserId: userId,
    ...commentData,
  });
};

// Get a comment by ID
const getCommentService = async (commentId) => {
  return await Comment.findByPk(commentId);
};

// Update a comment
const updateCommentService = async (comment, content) => {
  comment.content = content;
  return await comment.save();
};

export {
  findCommentById,
  isAuthorizedToDelete,
  isUserAuthorizedToUpdate,
  deleteCommentService,
  createCommentService,
  getCommentService,
  updateCommentService,
};
