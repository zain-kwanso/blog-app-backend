import statusCodes from "../constants/statusCodes.js";
import { signinService, signupService } from "../services/userService.js";

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await signinService(email, password);
    return res.status(statusCodes.SUCCESS).json({ token });
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(statusCodes.NOT_FOUND).json({ error: error.message });
    }
    return res.status(statusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

const signup = async (req, res) => {
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

export { signin, signup };
