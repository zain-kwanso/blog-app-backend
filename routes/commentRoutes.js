import express from "express";
import {
  createComment,
  deleteComment,
  updateComment,
} from "../controllers/commentController.js";
import { authenticateToken } from "../middleware/auth.js";
import {
  commentUpdateRules,
  commentCreationRules,
  commentDeleteRules,
} from "../middleware/commentValidators.js";
import { validate } from "../middleware/validationCheck.js";

const router = express.Router();

router.post(
  "/create",
  authenticateToken,
  validate(commentCreationRules),
  createComment
);

router.delete(
  "/:id",
  authenticateToken,

  validate(commentDeleteRules),
  deleteComment
);
router.put(
  "/:id",
  authenticateToken,

  validate(commentUpdateRules),
  updateComment
);

export default router;
