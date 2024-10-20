// postService.ts

import { Sequelize, Op } from "sequelize";
import { Request } from "express";
import User from "../models/user.ts";
import Post from "../models/post.ts";
import Comment from "../models/comment.ts";
import { PostCreationAttributes, PostInstance } from "../@types/models/post";
import { CommentInstance } from "../@types/models/comment.ts";

// Helper function to find the post by ID
const findPostById = async (postId: number): Promise<PostInstance | null> => {
  return await Post.findOne({
    where: {
      id: postId,
    },
  });
};

// Helper function to check if the user is authorized to delete the post
const isUserAuthorized = (post: PostInstance, userId: number): boolean =>
  post?.UserId === userId;

const deleteCommentsByPostId = async (
  postId: number
): Promise<number | null> => {
  return await Comment.destroy({
    where: {
      PostId: postId,
    },
  });
};

const constructNextPageUrl = (
  req: Request,
  nextPage: number | null,
  limit: number
): string | null =>
  nextPage
    ? `${req.protocol}://${req.get("host")}${
        req.originalUrl.split("?")[0]
      }?page=${nextPage}&limit=${limit}&search=${req.query.search || ""}`
    : null;

const constructPreviousPageUrl = (
  req: Request,
  previousPage: number | null,
  limit: number
): string | null =>
  previousPage
    ? `${req.protocol}://${req.get("host")}${
        req.originalUrl.split("?")[0]
      }?page=${previousPage}&limit=${limit}&search=${req.query.search || ""}`
    : null;

const fetchPostsWithPaginationAndSearch = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  userId: number | null = null
) => {
  const offset = (page - 1) * limit;
  const searchCondition = search
    ? {
        [Op.or]: [
          { title: { [Op.iLike]: `%${search}%` } },
          { content: { [Op.iLike]: `%${search}%` } },
        ],
      }
    : {};

  const userCondition = userId ? { UserId: userId } : {};
  const whereCondition = { ...searchCondition, ...userCondition };

  const { count, rows } = await Post.findAndCountAll({
    where: whereCondition,
    include: [
      {
        model: User,
        attributes: [],
      },
    ],
    attributes: {
      include: [[Sequelize.col("User.name"), "authorName"]],
    },
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  const totalPages = Math.ceil(count / limit);
  const nextPage = page < totalPages ? page + 1 : null;
  const previousPage = page > 1 ? page - 1 : null;

  return { rows, totalPages, nextPage, previousPage };
};

// Create a new post
const createPost = async (
  userId: number,
  postData: PostCreationAttributes
): Promise<PostInstance> => {
  return await Post.create({ UserId: userId, ...postData });
};

// Get a post's comments by ID
const getPostComments = async (postId: number): Promise<CommentInstance[]> => {
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

// Get a post by ID
const getPost = async (postId: number): Promise<PostInstance | null> => {
  return await Post.findByPk(postId);
};

// Update a post
const updatePost = async (
  post: PostInstance,
  updatedData: PostCreationAttributes
) => {
  return await post.update(updatedData);
};

// Delete a post
const deletePost = async (post: PostInstance) => {
  await post.destroy();
};

// send notification service with redis client
// const sendNotifications = async (bloggerId: number) => {
//   try {
//     const followers = await getFollowers(bloggerId);

//     followers.forEach(async (follower) => {
//       const taskId = `sendEmailTo_${follower.id}`;

//       try {
//         await redisClient.set(taskId, JSON.stringify(follower));

//         setTimeout(async () => {
//           setTimeout(() => {
//             console.log(
//               `\n\n ************************Sending email to follower ${follower.id}*********************************`
//             );
//           }, 5000);

//           const followerData = await redisClient.get(taskId);
//           if (followerData) {
//             console.log(`Email sent to: ${followerData}`);
//             await redisClient.del(taskId);
//           }
//         }, 10000);
//       } catch (err) {
//         console.error("Redis Error:", err);
//       }
//     });
//   } catch (err) {
//     console.error("Error sending notifications:", err);
//   }
// };

export {
  findPostById,
  isUserAuthorized,
  deleteCommentsByPostId,
  fetchPostsWithPaginationAndSearch,
  createPost,
  getPost,
  getPostComments,
  updatePost,
  deletePost,
  constructNextPageUrl,
  constructPreviousPageUrl,
};
