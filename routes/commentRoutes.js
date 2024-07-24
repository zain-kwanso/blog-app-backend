import express from "express";
import {
  createComment,
  getComment,
  deleteComment,
  updateComment,
} from "../controllers/commentController.js";
import { authenticateToken } from "../Middleware/auth.js";

const router = express.Router();

router.post("/create", authenticateToken, createComment);
router.get("/:id", getComment);
router.delete("/:id", authenticateToken, deleteComment);
router.put("/:id", authenticateToken, updateComment);

export default router;
