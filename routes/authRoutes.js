import express from "express";
import { signin, signup } from "../controllers/authController.js";
import {
  userValidationRules,
  loginValidationRules,
} from "../middleware/userValidators.js";
import { validate } from "../middleware/validationCheck.js";

const router = express.Router();

router.post("/signin", validate(loginValidationRules), signin);
router.post("/signup", validate(userValidationRules), signup);

export default router;
