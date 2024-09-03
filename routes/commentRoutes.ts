import express from "express";
import {
  createComment,
  deleteComment,
  updateComment,
} from "../controllers/commentController.ts";
import { authenticateToken } from "../middleware/auth.ts";
import {
  commentUpdateRules,
  commentCreationRules,
  commentDeleteRules,
} from "../middleware/commentValidators.ts";
import { validate } from "../middleware/validationCheck.ts";

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