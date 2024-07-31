import express from "express";
import {
  createPost,
  getAllPosts,
  getPostsByUser,
  deletePost,
  updatePost,
} from "../controllers/postController.js";
import { authenticateToken } from "../middleware/auth.js";
import {
  postCreationRules,
  postDeleteRules,
  postUpdateRules,
} from "../middleware/postValidators.js";
import { validate } from "../middleware/validationCheck.js";

const router = express.Router();

router.post(
  "/create",
  authenticateToken,
  postCreationRules,
  validate,
  createPost
);
router.get("/", authenticateToken, getAllPosts);
router.get("/user", authenticateToken, getPostsByUser);
router.delete("/:id", authenticateToken, validate(postDeleteRules), deletePost);
router.put("/:id", authenticateToken, validate(postUpdateRules), updatePost);

export default router;
