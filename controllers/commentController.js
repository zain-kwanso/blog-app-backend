import {
  findCommentService,
  isAuthorized,
  deleteCommentService,
  createCommentService,
  getCommentService,
  updateCommentService,
} from "../services/commentService.js";
import { statusCodes } from "../constants/statusCodes.js";

const createCommentController = async (req, res) => {
  try {
    const comment = await createCommentService(req.user.id, req.body);
    return res.status(statusCodes.CREATED).json(comment);
  } catch (error) {
    return res.status(statusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

const getCommentController = async (req, res) => {
  try {
    const comment = await getCommentService(req.params.id);
    if (comment) {
      return res.status(statusCodes.SUCCESS).json(comment);
    } else {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ error: "Comment not found" });
    }
  } catch (error) {
    return res.status(statusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

const deleteCommentController = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;

    const comment = await findCommentService(commentId);

    if (!comment) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ error: "Comment not found" });
    }

    if (!isAuthorized(comment.UserId, userId)) {
      return res
        .status(statusCodes.FORBIDDEN)
        .json({ error: "Not authorized to delete this comment" });
    }

    await deleteCommentService(commentId);

    return res
      .status(statusCodes.SUCCESS)
      .json({ message: `Comment deleted successfully` });
  } catch (error) {
    return res.status(statusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

const updateCommentController = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;
    const { content } = req.body;

    const comment = await findCommentService(commentId);

    if (!comment) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ error: "Comment not found" });
    }

    if (!isAuthorized(comment.UserId, userId)) {
      return res
        .status(statusCodes.FORBIDDEN)
        .json({ error: "Not authorized to update this comment" });
    }

    await updateCommentService(comment, content);

    return res
      .status(statusCodes.SUCCESS)
      .json({ message: `Comment updated successfully` });
  } catch (error) {
    return res.status(statusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

export {
  createCommentController as createComment,
  getCommentController as getComment,
  deleteCommentController as deleteComment,
  updateCommentController as updateComment,
};
