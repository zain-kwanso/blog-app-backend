import express from "express";
import { getUserNameById, getUser } from "../controllers/userController.ts";
import { userGetValidationRules } from "../middleware/userValidators.ts";
import { authenticateToken } from "../middleware/auth.ts";
import { validate } from "../middleware/validationCheck.ts";
const router = express.Router();
router.get("/me", authenticateToken, getUser);
router.get("/:id", authenticateToken, validate(userGetValidationRules), getUserNameById);
export default router;
