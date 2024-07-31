import { StatusCodes } from "http-status-codes";
import { signinService, signupService } from "../services/userService.js";

const signinController = async (req, res) => {
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

const signupController = async (req, res) => {
  try {
    const token = await signupService(req.body);

    if (!token) {
      return res
        .status(StatusCodes.BAD_REQUEST)
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

export { signinController as signin, signupController as signup };
