import { check, validationResult } from "express-validator";

const postCreationRules = [
  check("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 255 })
    .withMessage("Title must be less than 255 characters"),
  check("content").notEmpty().withMessage("Content is required"),
];

const postDeleteRules = [
  check("id").isInt().withMessage("Valid id is required"),
];

const postUpdateRules = [
  check("id").isInt().withMessage("Valid id is required to update the post"),
  check("title")
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 255 })
    .withMessage("Title must be less than 255 characters"),
  check("content").notEmpty().withMessage("Content cannot be empty"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export { postDeleteRules, postCreationRules, postUpdateRules, validate };
