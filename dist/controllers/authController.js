import { StatusCodes } from "http-status-codes";
import { signin as signinService, signup as signupService, } from "../services/userService.ts";
// Define the request and response types
const signin = async (req, res) => {
    try {
        const { email, password } = req?.body;
        const token = await signinService(email, password);
        if (!token) {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ error: "Invalid credentials" });
        }
        return res.status(StatusCodes.OK).json({ token });
    }
    catch (error) {
        // Type guard to handle the unknown type
        if (error instanceof Error) {
            console.log(error.message);
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: "Something Went Wrong Please Try Again Later" });
        }
        else {
            console.log("An unknown error occurred");
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: "Something Went Wrong Please Try Again Later" });
        }
    }
};
const signup = async (req, res) => {
    try {
        const token = await signupService(req?.body);
        if (!token) {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ error: "Email already in use" });
        }
        return res.status(StatusCodes.OK).json({ token });
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: "Something Went Wrong Please Try Again Later" });
        }
        else {
            console.log("An unknown error occurred");
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: "Something Went Wrong Please Try Again Later" });
        }
    }
};
export { signin, signup };
