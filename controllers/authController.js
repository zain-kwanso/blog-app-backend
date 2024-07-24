import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import db from "../models/index.js";
import statusCodes from "../constants/statusCodes.js";

const User = db.User;
dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET || "VerySecret";

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: {
        email: email,
        password: password,
      },
    });

    if (!user)
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ error: "User not found" });

    const token = jwt.sign(
      { userID: user.userID, email: user.email },
      SECRET_KEY
    );
    return res.status(statusCodes.SUCCESS).json(token);
  } catch (error) {
    return res.status(statusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

const signup = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = jwt.sign(
      { userID: user.userID, email: user.email },
      SECRET_KEY
    );

    return res.status(statusCodes.SUCCESS).json(token);
  } catch (error) {
    return res.status(statusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

export { signin, signup };
