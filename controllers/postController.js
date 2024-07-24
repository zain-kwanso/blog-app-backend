const { Post, Comment } = require("../models");
const statusCodes = require("../constants/statusCodes");
const { Op } = require("sequelize");

// Helper function to find the post by ID
const findPostById = async (postID) =>
  await Post.findOne({
    where: {
      postID: postID,
    },
  });

// Helper function to check if the user is authorized to delete the post
const isUserAuthorized = (post, userID) => post.userID === userID;

// Helper function to construct the response for not found
const notFoundResponse = (res) =>
  res.status(statusCodes.NOT_FOUND).json({ error: "Post not found" });

// Helper function to construct the response for unauthorized
const unauthorizedResponse = (res) =>
  res
    .status(statusCodes.FORBIDDEN)
    .json({ error: "Not authorized to delete this post" });

// Helper function to delete comments associated with the post
const deleteComments = async (postID) =>
  await Comment.destroy({
    where: {
      postID: postID,
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
  userID
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

  const userCondition = userID ? { userID } : {};

  const whereCondition = { ...searchCondition, ...userCondition };

  const { count, rows } = await Post.findAndCountAll({
    where: whereCondition,
    include: {
      model: Comment,
      where: { parentID: null },
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
  console.log(count);

  return { count, rows };
};

exports.createPost = async (req, res) => {
  try {
    const post = await Post.create({ userID: req.user.userID, ...req.body });
    return res.status(statusCodes.CREATED).json(post);
  } catch (error) {
    return badRequestResponse(res, error);
  }
};

exports.getPost = async (req, res) => {
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

exports.getPostsByUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || "";
    const userID = req.user ? req.user.userID : null;

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

exports.getAllPosts = async (req, res) => {
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

exports.deletePost = async (req, res) => {
  try {
    const postID = req.params.id;
    const userID = req.user.userID;

    const post = await findPostById(postID);

    if (!post) {
      return notFoundResponse(res);
    }

    if (!isUserAuthorized(post, userID)) {
      return unauthorizedResponse(res);
    }

    await deleteComments(postID);
    await post.destroy();

    return successResponse(res, "deleted");
  } catch (error) {
    return badRequestResponse(res, error);
  }
};

exports.updatePost = async (req, res) => {
  try {
    const postID = req.params.id;
    const userID = req.user.userID;
    const { title, content } = req.body;

    const post = await findPostById(postID);

    if (!post) {
      return notFoundResponse(res);
    }

    if (!isUserAuthorized(post, userID)) {
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
