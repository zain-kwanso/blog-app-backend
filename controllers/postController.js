import statusCodes from "../constants/statusCodes.js";
import {
  findPostById,
  isUserAuthorized,
  fetchPostsWithPaginationAndSearch,
  createPostService,
  getPostService,
  updatePostService,
  deletePostService,
  deleteCommentsByPostId,
} from "../services/postService.js";

import {
  unauthorizedResponse,
  notFoundResponse,
  successResponse,
  badRequestResponse,
} from "../utils/response.js";

// Helper function to construct next page URL
const constructNextPageUrl = (req, nextPage, limit) =>
  nextPage
    ? `${req.protocol}://${req.get("host")}${
        req.baseUrl
      }?page=${nextPage}&limit=${limit}&search=${req.query.search || ""}`
    : null;

const createPostController = async (req, res) => {
  try {
    const post = await createPostService(req.user.id, req.body);
    return res.status(statusCodes.CREATED).json(post);
  } catch (error) {
    return badRequestResponse(res, error);
  }
};

const getPostController = async (req, res) => {
  try {
    const post = await getPostService(req.params.id);
    if (post) {
      return res.status(statusCodes.SUCCESS).json(post);
    }
    return notFoundResponse(res);
  } catch (error) {
    return badRequestResponse(res, error);
  }
};

const getPostsByUserController = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || "";
    const userId = req.user ? req.user.id : null;

    const {
      rows: posts,
      totalPages,
      nextPage,
    } = await fetchPostsWithPaginationAndSearch(page, limit, search, userId);

    if (posts.length === 0) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ error: "No posts found" });
    }

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

const getAllPostsController = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || "";

    const {
      rows: posts,
      totalPages,
      nextPage,
    } = await fetchPostsWithPaginationAndSearch(page, limit, search);

    if (posts.length === 0) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ error: "No posts found" });
    }
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

const deletePostController = async (req, res) => {
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

    await deleteCommentsByPostId(postId);
    await deletePostService(post);

    return successResponse(res, "deleted");
  } catch (error) {
    return badRequestResponse(res, error);
  }
};

const updatePostController = async (req, res) => {
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

    await updatePostService(post, { title, content });

    return successResponse(res, "updated");
  } catch (error) {
    return badRequestResponse(res, error);
  }
};

export {
  createPostController as createPost,
  getPostController as getPost,
  getPostsByUserController as getPostsByUser,
  getAllPostsController as getAllPosts,
  deletePostController as deletePost,
  updatePostController as updatePost,
};
