import { check, validationResult } from "express-validator";

const commentCreationRules = [
  check("content").notEmpty().withMessage("Content is required"),
  check("UserId").notEmpty().withMessage("UserId is required"),
  check("PostId")
    .notEmpty()
    .withMessage("PostId is required")
    .isInt()
    .withMessage("PostId should be an Integer"),
  check("ParentId")
    .optional()
    .isInt()
    .withMessage("ParentId should be an Integer"),
];

const commentUpdateRules = [
  check("content").notEmpty().withMessage("Content cannot be empty"),
  check("title").notEmpty().withMessage("title cannot be empty"),
];

const commentDeleteRules = [
  check("id").isInt().withMessage("Valid comment id is required"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export {
  validate,
  commentUpdateRules,
  commentCreationRules,
  commentDeleteRules,
};
