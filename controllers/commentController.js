import {
  findCommentService,
  isAuthorized,
  deleteCommentService,
  createCommentService,
  getCommentService,
  updateCommentService,
} from "../services/commentService.js";
import { StatusCodes } from "http-status-codes";

const createCommentController = async (req, res) => {
  try {
    const comment = await createCommentService(req.user.id, req.body);
    if (!comment) {
      console.log(comment);
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "PostId not valid" });
    }
    return res.status(StatusCodes.CREATED).json(comment);
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something Went Wrong Please Try Again Later" });
  }
};

const getCommentController = async (req, res) => {
  try {
    const comment = await getCommentService(req.params.id);
    if (comment) {
      return res.status(StatusCodes.OK).json(comment);
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Comment not found" });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something Went Wrong Please Try Again Later" });
  }
};

const deleteCommentController = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;

    const comment = await findCommentService(commentId);

    if (!comment) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Comment not found" });
    }

    if (!isAuthorized(comment.UserId, userId)) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "Not authorized to delete this comment" });
    }

    await deleteCommentService(commentId);

    return res
      .status(StatusCodes.OK)
      .json({ message: `Comment deleted successfully` });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something Went Wrong Please Try Again Later" });
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
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Comment not found" });
    }

    if (!isAuthorized(comment.UserId, userId)) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "Not authorized to update this comment" });
    }

    await updateCommentService(comment, content);

    return res
      .status(StatusCodes.OK)
      .json({ message: `Comment updated successfully` });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something Went Wrong Please Try Again Later" });
  }
};

export {
  createCommentController as createComment,
  getCommentController as getComment,
  deleteCommentController as deleteComment,
  updateCommentController as updateComment,
};
