// services/userService.js
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// const User = db.User;
const SECRET_KEY = process.env.JWT_SECRET || "VerySecret";
// Signin service
const signinService = async (email, password) => {
  const user = await User.findOne({ where: { email: email } });

  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return null;
  }

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY);
  return token;
};

// Signup service
const signupService = async (userData) => {
  const { email, password } = userData;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return null;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...userData, password: hashedPassword });
  const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET_KEY);

  return token;
};

export { signinService, signupService };
