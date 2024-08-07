// services/userService.js
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const SECRET_KEY = process.env.JWT_SECRET || "VerySecret";
// Signin service
const signin = async (email, password) => {
  const user = await User.scope("withPassword").findOne({
    where: {
      email: email,
    },
  });

  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return null;
  }

  const token = jwt.sign({ id: user.id, name: user.name }, SECRET_KEY);
  return token;
};

// Signup service
const signup = async (userData) => {
  const { email, password, name } = userData;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return null;
  }

  // const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    email: email,
    name: name,
    password: password,
  });
  const token = jwt.sign({ id: newUser.id, name: newUser.name }, SECRET_KEY);

  return token;
};

// get user name service
const getUserNameById = async (id) => {
  const user = await User.findByPk(id);
  if (user) {
    return user.name;
  } else {
    return null;
  }
};

export { signin, signup, getUserNameById };
