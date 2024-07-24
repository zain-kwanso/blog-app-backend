import express from "express";
import {
  createPost,
  getAllPosts,
  getPostsByUser,
  deletePost,
  updatePost,
} from "../controllers/postController.js";
import { authenticateToken } from "../Middleware/auth.js";

const router = express.Router();

router.post("/create", authenticateToken, createPost);
router.get("/", authenticateToken, getAllPosts);
router.get("/user", authenticateToken, getPostsByUser);
router.delete("/:id", authenticateToken, deletePost);
router.put("/:id", authenticateToken, updatePost);

export default router;
