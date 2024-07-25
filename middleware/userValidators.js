import { check, validationResult } from "express-validator";

const userValidationRules = [
  check("name").notEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Enter a valid email address"),
  check("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long"),
];

const loginValidationRules = [
  check("email").isEmail().withMessage("Enter a valid email address"),
  check("password").notEmpty().withMessage("Password is required"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export { userValidationRules, loginValidationRules, validate };
