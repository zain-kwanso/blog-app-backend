const { Post, Comment } = require("../models");
const statusCodes = require("../constants/statusCodes");
const { Op } = require("sequelize");

// Helper function to check authorization
const isAuthorizedToDelete = (commentUserID, postUserID, currentUserID) =>
  commentUserID == currentUserID || postUserID == currentUserID;

// Helper function to check if the user is authorized to update the comment
const isUserAuthorizedToUpdate = (comment, userID) =>
  comment.userID === userID || comment.Post.userID === userID;

// Helper function to construct the response for not authorized
const notAuthorizedResponse = (res) =>
  res
    .status(statusCodes.FORBIDDEN)
    .json({ error: "Not authorized to delete this comment" });

// Helper function to construct the response for not found
const notFoundResponse = (res) =>
  res.status(statusCodes.NOT_FOUND).json({ error: "Comment not found" });

// Helper function to construct the response for success
const successResponse = (res, msg) =>
  res
    .status(statusCodes.SUCCESS)
    .json({ message: `Comment ${msg} successfully` });

// Helper function to construct the response for bad request
const badRequestResponse = (res, error) =>
  res.status(statusCodes.BAD_REQUEST).json({ error: error.message });

// Helper function to find the comment by ID
const findCommentById = async (commentID) =>
  await Comment.findOne({
    where: { commentID },
    include: {
      model: Post,
      attributes: ["userID"],
    },
  });

exports.createComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      userID: req.user.userID,
      ...req.body,
    });
    return res.status(statusCodes.CREATED).json(comment);
  } catch (error) {
    return badRequestResponse(res, error);
  }
};

exports.getComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (comment) {
      return res.status(statusCodes.SUCCESS).json(comment);
    } else {
      return notFoundResponse(res);
    }
  } catch (error) {
    return badRequestResponse(res, error);
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const commentID = req.params.id;
    const userID = req.user.userID;

    const comment = await findCommentById(commentID);

    if (!comment) {
      return notFoundResponse(res);
    }

    if (!isAuthorizedToDelete(comment.userID, comment.Post.userID, userID)) {
      return notAuthorizedResponse(res);
    }

    await Comment.destroy({
      where: {
        [Op.or]: [{ commentID }, { parentID: commentID }],
      },
    });

    return successResponse(res, "deleted");
  } catch (error) {
    return badRequestResponse(res, error);
  }
};

exports.updateComment = async (req, res) => {
  try {
    const commentID = req.params.id;
    const userID = req.user.userID;
    const { content } = req.body;

    const comment = await findCommentById(commentID);

    if (!comment) {
      return notFoundResponse(res);
    }

    if (!isUserAuthorizedToUpdate(comment, userID)) {
      return unauthorizedResponse(res);
    }

    comment.content = content;
    await comment.save();

    return successResponse(res, "updated");
  } catch (error) {
    return badRequestResponse(res, error);
  }
};
