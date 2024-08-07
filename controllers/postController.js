import { StatusCodes } from "http-status-codes";
import {
  findPostById as findPostByIdService,
  isUserAuthorized,
  fetchPostsWithPaginationAndSearch,
  createPost as createPostService,
  getPost as getPostService,
  updatePost as updatePostService,
  deletePost as deletePostService,
  deleteCommentsByPostId as deleteCommentsByPostIdService,
  constructNextPageUrl as constructNextPageUrlService,
} from "../services/postService.js";

const createPost = async (req, res) => {
  try {
    console.log(req.user);
    const post = await createPostService(req.user.id, req.body);
    return res.status(StatusCodes.CREATED).json(post);
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something Went Wrong Please Try Again Later" });
  }
};

const getPost = async (req, res) => {
  try {
    const post = await getPostService(req.params.id);
    if (post) {
      return res.status(StatusCodes.OK).json(post);
    }
    return res.status(StatusCodes.NOT_FOUND).json({ error: "Post not found" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something Went Wrong Please Try Again Later" });
  }
};

const getPostsByUser = async (req, res) => {
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
      return res.status(StatusCodes.OK).json({ posts });
    }

    const nextPageUrl = constructNextPageUrlService(req, nextPage, limit);

    return res.status(StatusCodes.OK).json({
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        nextPageUrl,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something Went Wrong Please Try Again Later" });
  }
};

const getAllPosts = async (req, res) => {
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
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "No posts found" });
    }
    const nextPageUrl = constructNextPageUrlService(req, nextPage, limit);

    return res.status(StatusCodes.OK).json({
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        nextPageUrl,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something Went Wrong Please Try Again Later" });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await findPostByIdService(postId);

    if (!post) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Post not found" });
    }

    if (!isUserAuthorized(post, userId)) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "Not authorized to delete this Post" });
    }

    await deleteCommentsByPostIdService(postId);
    await deletePostService(post);

    return res
      .status(StatusCodes.OK)
      .json({ message: `Post deleted successfully` });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something Went Wrong Please Try Again Later" });
  }
};

const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { title, content } = req.body;

    const post = await findPostByIdService(postId);

    if (!post) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Post not found" });
    }

    if (!isUserAuthorized(post, userId)) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "Not authorized to delete this post" });
    }

    await updatePostService(post, { title, content });

    return res
      .status(StatusCodes.OK)
      .json({ message: `Post updated successfully` });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something Went Wrong Please Try Again Later" });
  }
};

export {
  createPost,
  getPost,
  getPostsByUser,
  getAllPosts,
  deletePost,
  updatePost,
};
