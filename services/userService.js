// services/userService.js
import db from "../models/index.js";
import jwt from "jsonwebtoken";

const User = db.User;
const SECRET_KEY = process.env.JWT_SECRET || "VerySecret";

// Signin service
const signinService = async (email, password) => {
  const user = await User.findOne({
    where: {
      email: email,
      password: password,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY);
  return token;
};

// Signup service
const signupService = async (userData) => {
  const { email } = userData;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("E-mail already in use");
  }

  const newUser = await User.create(userData);
  const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET_KEY);

  return token;
};

export { signinService, signupService };
