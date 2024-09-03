import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { getUserNameById as getUserNameByIdService } from "../services/userService.ts";

const getUserNameById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    // Ensure id is a string, as it comes from the request params
    const name = await getUserNameByIdService(parseInt(id));
    if (!name) {
      return res.status(StatusCodes.OK).json({ name: "undefined" });
    }
    return res.status(StatusCodes.OK).json({ name });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log("An unknown error occurred");
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something Went Wrong Please Try Again Later" });
  }
};

const getUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user = req?.user;
    if (user) {
      return res.status(200).json({ user });
    }

    return res.status(StatusCodes.NOT_FOUND).json({ user: null });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log("An unknown error occurred");
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something Went Wrong Please Try Again Later" });
  }
};

export { getUserNameById, getUser };

//validation types
