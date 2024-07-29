import { body, param, validationResult } from "express-validator";
import { statusCodes } from "../constants/statusCodes";
const commentCreationRules = [
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

const commentUpdateRules = [
  body("content").notEmpty().withMessage("Content cannot be empty"),
  body("title").notEmpty().withMessage("title cannot be empty"),
  param("id").isInt().withMessage("Valid  id is required"),
];

const commentDeleteRules = [
  param("id").isInt().withMessage("Valid id is required"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(statusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }
  next();
};

export {
  validate,
  commentUpdateRules,
  commentCreationRules,
  commentDeleteRules,
};

// const commentUpdateRules = (req, res, next) => {
//   [
//     body("content").notEmpty().withMessage("Content cannot be empty"),
//     body("title").notEmpty().withMessage("title cannot be empty"),
//     param("id").isInt().withMessage("Valid id is required"),
//   ];

//   validate(req, res, next);
// };
