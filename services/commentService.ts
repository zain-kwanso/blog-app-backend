import { CommentInstance } from "../@types/models/comment";

import Comment from "../models/comment.ts";
import User from "../models/user.ts";

// Helper function to find the comment by ID
const findComment = async (commentId: number) =>
  await Comment.findOne({
    where: {
      id: commentId,
    },
  });

// Helper function to check authorization
const isAuthorized = (commentUserID: number, currentUserID: number): boolean =>
  commentUserID === currentUserID;

// Helper function to delete comment
const deleteComment = async (commentId: number): Promise<void> => {
  await Comment.destroy({
    where: {
      id: commentId,
    },
  });
};

// Create a new comment
const createComment = async (
  userId: number,
  PostId: number,
  content: string,
  ParentId?: number
) => {
  console.log(userId);
  if (!ParentId)
    return await Comment.create({
      UserId: userId,
      PostId: PostId,
      content: content,
    });
  const comment = await Comment.findByPk(ParentId);
  if (comment?.PostId == PostId) {
    return await Comment.create({
      UserId: userId,
      ParentId: ParentId,
      PostId: PostId,
      content: content,
    });
  }
  return null;
};

// Get a comment by ID
const getComment = async (postId: number): Promise<CommentInstance[]> => {
  return await Comment.findAll({
    where: {
      PostId: postId,
      ParentId: null,
    },
    include: [
      {
        model: Comment,
        as: "replies",
        required: false,
        include: [
          {
            model: User,
            attributes: ["name"],
          },
        ],
      },
      {
        model: User,
        attributes: ["name"],
      },
    ],
  });
};

// Update a comment
const updateComment = async (comment: CommentInstance, content: string) => {
  comment.content = content;
  return await comment.save();
};

export {
  findComment,
  isAuthorized,
  deleteComment,
  createComment,
  getComment,
  updateComment,
};
