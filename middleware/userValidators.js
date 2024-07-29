import { body, validationResult } from "express-validator";
import { statusCodes } from "../constants/statusCodes.js";
const userValidationRules = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Enter a valid email address"),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long"),
];

const loginValidationRules = [
  body("email").isEmail().withMessage("Enter a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(statusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }
  next();
};

export { userValidationRules, loginValidationRules, validate };
