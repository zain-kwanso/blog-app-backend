import { statusCodes } from "../constants/statusCodes.js";

// Helper function to construct the response for not authorized
const unauthorizedResponse = (res) =>
  res
    .status(statusCodes.FORBIDDEN)
    .json({ error: "Not authorized to delete this comment" });

// Helper function to construct the response for not found
const notFoundResponse = (res) =>
  res.status(statusCodes.NOT_FOUND).json({ error: "Comment not found" });

// Helper function to construct the response for success
const successResponse = (res, msg) =>
  res
    .status(statusCodes.SUCCESS)
    .json({ message: `Comment deleted successfully` });

// Helper function to construct the response for bad request
const badRequestResponse = (res, error) =>
  res.status(statusCodes.BAD_REQUEST).json({ error: error.message });

export {
  unauthorizedResponse,
  notFoundResponse,
  successResponse,
  badRequestResponse,
};
