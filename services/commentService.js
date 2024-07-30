import Comment from "../models/comment.js";

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
  const { ParentId, PostId } = commentData;
  if (!ParentId)
    return await Comment.create({
      UserId: userId,
      ...commentData,
    });
  const comment = await Comment.findByPk(ParentId);
  if (comment.PostId == PostId) {
    return await Comment.create({
      UserId: userId,
      ...commentData,
    });
  }
  return null;
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
