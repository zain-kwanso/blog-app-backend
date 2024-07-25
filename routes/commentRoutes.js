import express from "express";
import {
  createComment,
  deleteComment,
  updateComment,
} from "../controllers/commentController.js";
import { authenticateToken } from "../middleware/auth.js";
import {
  validate,
  commentUpdateRules,
  commentCreationRules,
  commentDeleteRules,
} from "../middleware/commentValidators.js";

const router = express.Router();

router.post(
  "/create",
  authenticateToken,
  commentCreationRules,
  validate,
  createComment
);

router.delete(
  "/:id",
  authenticateToken,
  commentDeleteRules,
  validate,
  deleteComment
);
router.put(
  "/:id",
  authenticateToken,
  commentUpdateRules,
  validate,
  updateComment
);

export default router;
