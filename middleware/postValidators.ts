import { body, param, ValidationChain } from "express-validator";
const postCreationRules: ValidationChain[] = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 255 })
    .withMessage("Title must be less than 255 characters"),
  body("content").notEmpty().withMessage("Content is required"),
];

const postDeleteRules: ValidationChain[] = [
  param("id").isInt().withMessage("Valid id is required"),
];

const postUpdateRules: ValidationChain[] = [
  param("id").isInt().withMessage("Valid id is required to update the post"),
  body("title")
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 255 })
    .withMessage("Title must be less than 255 characters"),
  body("content").notEmpty().withMessage("Content cannot be empty"),
];

export { postDeleteRules, postCreationRules, postUpdateRules };
