require("dotenv").config();
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const statusCodes = require("../constants/statusCodes");
const SECRET_KEY = process.env.JWT_SECRET || "VerySecret";

exports.signin = async (req, res) => {
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

exports.signup = async (req, res) => {
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
