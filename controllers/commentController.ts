import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import {
  findComment as findCommentService,
  isAuthorized,
  deleteComment as deleteCommentService,
  createComment as createCommentService,
  getComment as getCommentService,
  updateComment as updateCommentService,
} from "../services/commentService.ts";

const createComment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { ParentId, PostId, content } = req?.body;
    const comment = await createCommentService(
      req?.user?.id,
      PostId,
      content,
      ParentId
    );
    if (!comment) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "PostId not valid" });
    }
    return res.status(StatusCodes.CREATED).json(comment);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log("An unknown error occurred");
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something Went Wrong Please Try Again Later" });
  }
};

const getComment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const comments = await getCommentService(parseInt(req?.params?.id));
    if (comments) {
      return res.status(StatusCodes.OK).json(comments);
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Comment not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log("An unknown error occurred");
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something Went Wrong Please Try Again Later" });
  }
};

const deleteComment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const commentId = parseInt(req?.params?.id);
    const userId = parseInt(req.user?.id?.toString());

    const comment = await findCommentService(commentId);

    if (!comment) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Comment not found" });
    }

    if (!isAuthorized(comment?.UserId, userId)) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "Not authorized to delete this comment" });
    }

    await deleteCommentService(commentId);

    return res
      .status(StatusCodes.OK)
      .json({ message: `Comment deleted successfully` });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log("An unknown error occurred");
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something Went Wrong Please Try Again Later" });
  }
};

const updateComment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const commentId = parseInt(req.params?.id);
    const userId = parseInt(req.user?.id?.toString());
    const { content } = req.body;

    const comment = await findCommentService(commentId);

    if (!comment) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Comment not found" });
    }

    if (!isAuthorized(comment?.UserId, userId)) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "Not authorized to update this comment" });
    }

    await updateCommentService(comment, content);

    return res
      .status(StatusCodes.OK)
      .json({ message: `Comment updated successfully` });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log("An unknown error occurred");
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something Went Wrong Please Try Again Later" });
  }
};

export { createComment, getComment, deleteComment, updateComment };
