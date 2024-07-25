import express from "express";
import { signin, signup } from "../controllers/authController.js";
import {
  userValidationRules,
  loginValidationRules,
  validate,
} from "../middleware/userValidators.js";

const router = express.Router();

router.post("/signin", loginValidationRules, validate, signin);
router.post("/signup", userValidationRules, validate, signup);

export default router;
