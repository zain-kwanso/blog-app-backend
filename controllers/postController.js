import db from "../models/index.js";
import statusCodes from "../constants/statusCodes.js";
import Op from "sequelize";

const Post = db.Post,
  Comment = db.Comment;

// Helper function to find the post by ID
const findPostById = async (postId) =>
  await Post.findOne({
    where: {
      id: postId,
    },
  });

// Helper function to check if the user is authorized to delete the post
const isUserAuthorized = (post, userId) => post.UserId === userId;

// Helper function to construct the response for not found
const notFoundResponse = (res) =>
  res.status(statusCodes.NOT_FOUND).json({ error: "Post not found" });

// Helper function to construct the response for unauthorized
const unauthorizedResponse = (res) =>
  res
    .status(statusCodes.FORBIDDEN)
    .json({ error: "Not authorized to delete this post" });

// Helper function to delete comments associated with the post
const deleteComments = async (postId) =>
  await Comment.destroy({
    where: {
      PostId: postId,
    },
  });

// Helper function to construct the response for success
const successResponse = (res, msg) =>
  res.status(statusCodes.SUCCESS).json({ message: `Post ${msg} successfully` });

// Helper function to construct the response for bad request
const badRequestResponse = (res, error) =>
  res.status(statusCodes.BAD_REQUEST).json({ error: error.message });

// Helper function to construct next page URL
const constructNextPageUrl = (req, nextPage, limit) =>
  nextPage
    ? `${req.protocol}://${req.get("host")}${
        req.baseUrl
      }?page=${nextPage}&limit=${limit}&search=${req.query.search || ""}`
    : null;

// Helper function for fetching posts with pagination and search
const fetchPostsWithPaginationAndSearch = async (
  page,
  limit,
  search,
  userId
) => {
  const offset = page - 1;
  const searchCondition = search
    ? {
        [Op.or]: [
          { title: { [Op.iLike]: `%${search}%` } },
          { content: { [Op.iLike]: `%${search}%` } },
        ],
      }
    : {};

  const userCondition = userId ? { userId } : {};

  const whereCondition = { ...searchCondition, ...userCondition };

  const { count, rows } = await Post.findAndCountAll({
    where: whereCondition,
    include: {
      model: Comment,
      where: { ParentId: null },
      required: false,
      include: {
        model: Comment,
        as: "replies",
        required: false,
        include: {
          model: Comment,
          as: "replies",
          required: false,
        },
      },
    },
    limit,
    offset,
  });
  // console.log(count);

  return { count, rows };
};

const createPost = async (req, res) => {
  try {
    const post = await Post.create({ UserId: req.user.id, ...req.body });
    return res.status(statusCodes.CREATED).json(post);
  } catch (error) {
    return badRequestResponse(res, error);
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (post) {
      return res.status(statusCodes.SUCCESS).json(post);
    }
    return res.status(statusCodes.NOT_FOUND).json({ error: "Post not found" });
  } catch (error) {
    return res.status(statusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

const getPostsByUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || "";
    const userID = req.user ? req.user.id : null;

    const { count, rows: posts } = await fetchPostsWithPaginationAndSearch(
      page,
      limit,
      search,
      userID
    );

    if (posts.length === 0) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ error: "No posts found" });
    }

    const totalPages = Math.ceil((count - 1) / limit);
    const nextPage = page < totalPages ? page + 1 : null;
    const nextPageUrl = constructNextPageUrl(req, nextPage, limit);

    return res.status(statusCodes.SUCCESS).json({
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        nextPageUrl,
      },
    });
  } catch (error) {
    return badRequestResponse(res, error);
  }
};

const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || "";

    const { count, rows: posts } = await fetchPostsWithPaginationAndSearch(
      page,
      limit,
      search
    );

    if (posts.length === 0) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ error: "No posts found" });
    }
    const totalPages = Math.ceil((count - 1) / limit);
    const nextPage = page < totalPages ? page + 1 : null;
    const nextPageUrl = constructNextPageUrl(req, nextPage, limit);

    return res.status(statusCodes.SUCCESS).json({
      posts,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        nextPageUrl: nextPageUrl,
      },
    });
  } catch (error) {
    return badRequestResponse(res, error);
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await findPostById(postId);

    if (!post) {
      return notFoundResponse(res);
    }

    if (!isUserAuthorized(post, userId)) {
      return unauthorizedResponse(res);
    }

    await deleteComments(postId);
    await post.destroy();

    return successResponse(res, "deleted");
  } catch (error) {
    return badRequestResponse(res, error);
  }
};

const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { title, content } = req.body;

    const post = await findPostById(postId);

    if (!post) {
      return notFoundResponse(res);
    }

    if (!isUserAuthorized(post, userId)) {
      return unauthorizedResponse(res);
    }

    await post.update({
      title: title,
      content: content,
    });

    return successResponse(res, "updated");
  } catch (error) {
    return badRequestResponse(res, error);
  }
};

export {
  updatePost,
  deletePost,
  getAllPosts,
  getPostsByUser,
  getPost,
  createPost,
};
