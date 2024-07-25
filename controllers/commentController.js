import db from "../models/index.js";
import statusCodes from "../constants/statusCodes.js";
import Op from "sequelize";

const Post = db.User,
  Comment = db.Comment;
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

//error throw
const badRequestResponse = (res, error) =>
  res.status(statusCodes.BAD_REQUEST).json({ error: error.message });

// Helper function to find the comment by ID
const findCommentById = async (commentId) =>
  await Comment.findOne({
    where: { id: commentId },
    include: {
      model: Post,
      attributes: ["UserId"],
    },
  });

const createComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      UserId: req.user.id,
      ...req.body,
    });
    return res.status(statusCodes.CREATED).json(comment);
  } catch (error) {
    return badRequestResponse(res, error);
  }
};

const getComment = async (req, res) => {
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

const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.ussequelizeerID;

    const comment = await findCommentById(commentId);

    if (!comment) {
      return notFoundResponse(res);
    }

    if (!isAuthorizedToDelete(comment.UserId, comment.Post.UserId, userId)) {
      return notAuthorizedResponse(res);
    }

    await Comment.destroy({
      where: {
        [Op.or]: [{ id: commentId }, { ParentId: commentId }],
      },
    });

    return successResponse(res, "deleted");
  } catch (error) {
    return badRequestResponse(res, error);
  }
};

const updateComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;
    const { content } = req.body;

    const comment = await findCommentById(commentId);

    if (!comment) {
      return notFoundResponse(res);
    }

    if (!isUserAuthorizedToUpdate(comment, userId)) {
      return unauthorizedResponse(res);
    }

    comment.content = content;
    await comment.save();

    return successResponse(res, "updated");
  } catch (error) {
    return badRequestResponse(res, error);
  }
};

export { updateComment, deleteComment, getComment, createComment };
