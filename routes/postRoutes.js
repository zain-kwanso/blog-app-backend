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
  validate,
} from "../middleware/postValidators.js";

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
router.delete("/:id", authenticateToken, postDeleteRules, validate, deletePost);
router.put("/:id", authenticateToken, postUpdateRules, validate, updatePost);

export default router;
