import { body, param, ValidationChain } from "express-validator";
const userValidationRules: ValidationChain[] = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Enter a valid email address"),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long"),
];

const loginValidationRules: ValidationChain[] = [
  body("email").isEmail().withMessage("Enter a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];

const userGetValidationRules: ValidationChain[] = [
  param("id").isInt().withMessage("Valid id is required"),
];

export { userValidationRules, loginValidationRules, userGetValidationRules };
