import express from "express";
import postRoutes from "./postRoutes.js";
import commentRoutes from "./commentRoutes.js";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";

const router = express.Router();

router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);

export default router;
