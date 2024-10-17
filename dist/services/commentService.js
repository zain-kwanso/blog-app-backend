import Comment from "../models/comment.ts";
import User from "../models/user.ts";
// Helper function to find the comment by ID
const findComment = async (commentId) => await Comment.findOne({
    where: {
        id: commentId,
    },
});
// Helper function to check authorization
const isAuthorized = (commentUserID, currentUserID) => commentUserID === currentUserID;
// Helper function to delete comment
const deleteComment = async (commentId) => {
    await Comment.destroy({
        where: {
            id: commentId,
        },
    });
};
// Create a new comment
const createComment = async (userId, PostId, content, ParentId) => {
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
const getComment = async (postId) => {
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
const updateComment = async (comment, content) => {
    comment.content = content;
    return await comment.save();
};
export { findComment, isAuthorized, deleteComment, createComment, getComment, updateComment, };
