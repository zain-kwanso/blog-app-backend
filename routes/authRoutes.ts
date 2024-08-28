import express from "express";
import { signin, signup } from "../controllers/authController.ts";
import {
  userValidationRules,
  loginValidationRules,
} from "../middleware/userValidators.ts";
import { validate } from "../middleware/validationCheck.ts";

const router = express.Router();

router.post("/signin", validate(loginValidationRules), signin);
router.post("/signup", validate(userValidationRules), signup);

export default router;
