import { statusCodes } from "../constants/statusCodes.js";
import { signinService, signupService } from "../services/userService.js";

const signinController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await signinService(email, password);
    if (!token) {
      return res
        .status(statusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }
    return res.status(statusCodes.SUCCESS).json({ token });
  } catch (error) {
    return res.status(statusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

const signupController = async (req, res) => {
  try {
    const token = await signupService(req.body);
    return res.status(statusCodes.SUCCESS).json({ token });
  } catch (error) {
    if (error.message === "E-mail already in use") {
      return res.status(statusCodes.BAD_REQUEST).json({ error: error.message });
    }
    return res.status(statusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

export { signinController as signin, signupController as signup };
