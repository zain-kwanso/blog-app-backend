// services/userService.js
import User from "../models/user.ts";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserCreationAttributes } from "../@types/models/user";

const SECRET_KEY = process.env.JWT_SECRET || "VerySecret";
// Signin service
const signin = async (
  email: string,
  password: string
): Promise<string | null> => {
  const user = await User.scope("withPassword").findOne({
    where: {
      email: email,
    },
  });

  if (!user || !user.password) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user?.password);
  if (!isPasswordValid) {
    return null;
  }

  const token = jwt.sign({ id: user?.id, name: user?.name }, SECRET_KEY);
  return token;
};

// Signup service
const signup = async (
  userData: UserCreationAttributes
): Promise<string | null> => {
  const { email, password, name } = userData;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return null;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email: email,
    name: name,
    password: hashedPassword,
  });

  const token = jwt.sign({ id: newUser?.id, name: newUser?.name }, SECRET_KEY);

  return token;
};

// get user name service
const getUserNameById = async (id: number): Promise<string | null> => {
  const user = await User.findByPk(id);
  return user ? user?.name : null;
};

export { signin, signup, getUserNameById };
