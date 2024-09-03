import express, { Router } from "express";
import postRoutes from "./postRoutes.ts";
import commentRoutes from "./commentRoutes.ts";
import authRoutes from "./authRoutes.ts";
import userRoutes from "./userRoutes.ts";

const router: Router = express.Router();

router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);

export default router;
