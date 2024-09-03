import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { Payload } from "../@types/module";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "VerySecret";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];
  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Token not provided" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err)
      return res.status(StatusCodes.FORBIDDEN).json({ error: "Invalid token" });

    req.user = user as Payload;
    next();
  });
};
