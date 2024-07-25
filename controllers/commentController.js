import {
  unauthorizedResponse,
  notFoundResponse,
  successResponse,
  badRequestResponse,
} from "../utils/response.js";
import {
  findCommentById,
  isAuthorizedToDelete,
  isUserAuthorizedToUpdate,
  deleteCommentById,
  createCommentService,
  getCommentService,
  updateCommentService,
} from "../services/commentService.js";
import statusCodes from "../constants/statusCodes.js";

const createCommentController = async (req, res) => {
  try {
    const comment = await createCommentService(req.user.id, req.body);
    return res.status(statusCodes.CREATED).json(comment);
  } catch (error) {
    return badRequestResponse(res, error);
  }
};

const getCommentController = async (req, res) => {
  try {
    const comment = await getCommentService(req.params.id);
    if (comment) {
      return res.status(statusCodes.SUCCESS).json(comment);
    } else {
      return notFoundResponse(res);
    }
  } catch (error) {
    return badRequestResponse(res, error);
  }
};

const deleteCommentController = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;

    const comment = await findCommentById(commentId);

    if (!comment) {
      return notFoundResponse(res);
    }

    if (!isAuthorizedToDelete(comment.UserId, comment.Post.UserId, userId)) {
      return unauthorizedResponse(res);
    }

    await deleteCommentById(commentId);

    return successResponse(res, "deleted");
  } catch (error) {
    return badRequestResponse(res, error);
  }
};

const updateCommentController = async (req, res) => {
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

    await updateCommentService(comment, content);

    return successResponse(res, "updated");
  } catch (error) {
    return badRequestResponse(res, error);
  }
};

export {
  createCommentController as createComment,
  getCommentController as getComment,
  deleteCommentController as deleteComment,
  updateCommentController as updateComment,
};
