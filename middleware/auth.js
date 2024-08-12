import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { statusCodes } from "../constants/statusCodes.js";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "VerySecret";

export const authenticateToken = (req, res, next) => {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];
  if (!token) {
    return res
      .status(statusCodes.UNAUTHORIZED)
      .json({ error: "Token not provided" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err)
      return res.status(statusCodes.FORBIDDEN).json({ error: "Invalid token" });

    req.user = user;
    next();
  });
};
