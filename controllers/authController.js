import { StatusCodes } from "http-status-codes";
import {
  signin as signinService,
  signup as signupService,
} from "../services/userService.js";

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await signinService(email, password);
    if (!token) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "Invalid credentials" });
    }
    return res.status(StatusCodes.OK).json({ token });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something Went Wrong Please Try Again Later" });
  }
};

const signup = async (req, res) => {
  try {
    const token = await signupService(req.body);

    if (!token) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "Email already in use" });
    }

    return res.status(StatusCodes.OK).json({ token });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something Went Wrong Please Try Again Later" });
  }
};

export { signin, signup };
