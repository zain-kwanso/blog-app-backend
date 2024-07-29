import Comment from "../models/comment.js";

// const Comment = db.Comment;

// Helper function to find the comment by ID
const findCommentService = async (commentId) =>
  await Comment.findOne({
    where: {
      id: commentId,
    },
  });

// Helper function to check authorization
const isAuthorized = (commentUserID, currentUserID) =>
  commentUserID == currentUserID;

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
  findCommentService,
  isAuthorized,
  deleteCommentService,
  createCommentService,
  getCommentService,
  updateCommentService,
};
