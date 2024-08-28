import express from "express";
import {
  createPost,
  getAllPosts,
  getPostsByUser,
  getPost,
  deletePost,
  getPostComments,
  updatePost,
} from "../controllers/postController.ts";
import { authenticateToken } from "../middleware/auth.ts";
import {
  postCreationRules,
  postDeleteRules,
  postUpdateRules,
} from "../middleware/postValidators.ts";
import { validate } from "../middleware/validationCheck.ts";

const router = express.Router();

router.post(
  "/create",
  authenticateToken,
  validate(postCreationRules),
  createPost
);

router.get("/", getAllPosts);
router.get("/user", authenticateToken, getPostsByUser);
router.get("/:id/comments", getPostComments);
router.get("/:id", getPost);

router.delete("/:id", authenticateToken, validate(postDeleteRules), deletePost);
router.put("/:id", authenticateToken, validate(postUpdateRules), updatePost);

export default router;
