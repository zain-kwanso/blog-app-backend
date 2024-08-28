import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain } from "express-validator";
import { StatusCodes } from "http-status-codes";

const validate = (validationRules: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validationRules.map((rule) => rule.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }
    next();
  };
};

export { validate };
