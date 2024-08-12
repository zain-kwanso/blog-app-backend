import express from "express";
import {
  createPost,
  getAllPosts,
  getPostsByUser,
  getPost,
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
  validate(postCreationRules),
  createPost
);

router.get("/", getAllPosts);
router.get("/user", authenticateToken, getPostsByUser);
router.get("/:id", getPost);
router.delete("/:id", authenticateToken, validate(postDeleteRules), deletePost);
router.put("/:id", authenticateToken, validate(postUpdateRules), updatePost);

export default router;
