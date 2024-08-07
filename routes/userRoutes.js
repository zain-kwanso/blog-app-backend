import express from "express";
import { getUserNameById } from "../controllers/userController.js";
import { userGetValidationRules } from "../middleware/userValidators.js";
import { authenticateToken } from "../middleware/auth.js";
import { validate } from "../middleware/validationCheck.js";

const router = express.Router();

router.get(
  "/:id",
  authenticateToken,
  validate(userGetValidationRules),
  getUserNameById
);

export default router;
