import { body, param, ValidationChain } from "express-validator";
const commentCreationRules: ValidationChain[] = [
  body("content").notEmpty().withMessage("Content is required"),

  body("PostId")
    .notEmpty()
    .withMessage("PostId is required")
    .isInt()
    .withMessage("PostId should be an Integer"),
  body("ParentId")
    .optional()
    .isInt()
    .withMessage("ParentId should be an Integer"),
];

const commentUpdateRules: ValidationChain[] = [
  body("content").notEmpty().withMessage("Content cannot be empty"),
  body("title").notEmpty().withMessage("title cannot be empty"),
  param("id").isInt().withMessage("Valid  id is required"),
];

const commentDeleteRules: ValidationChain[] = [
  param("id").isInt().withMessage("Valid id is required"),
];

export { commentUpdateRules, commentCreationRules, commentDeleteRules };
