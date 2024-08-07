import { StatusCodes } from "http-status-codes";
import { getUserNameById as getUserNameByIdService } from "../services/userService.js";

const getUserNameById = async (req, res) => {
  try {
    const { id } = req.params;
    const name = await getUserNameByIdService(id);
    if (!name) {
      return res.status(StatusCodes.OK).json({ name: "undefined" });
    }
    return res.status(StatusCodes.OK).json({ name });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something Went Wrong Please Try Again Later" });
  }
};

export { getUserNameById };
